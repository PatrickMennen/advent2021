import fs from 'fs/promises';

const loadData = async (): Promise<number[][]> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split('\n')
    .map((l) => l.split('').map((n) => Number(n)));
};

const getAdjacentPointWithCoordinates = (x: number, y: number, data: number[][]): number[][] => {
  const maxInArray = data.length - 1;
  const maxInLine = data[0].length - 1;

  const diagonalUpLeft = y > 0 && x - 1 >= 0 ? [x - 1, y - 1, data[y - 1][x - 1]] : undefined;
  const diagonalUpRight =
    y > 0 && x + 1 <= maxInLine ? [x + 1, y - 1, data[y - 1][x + 1]] : undefined;
  const diagonalBottomLeft =
    y < maxInArray && x - 1 >= 0 ? [x - 1, y + 1, data[y + 1][x - 1]] : undefined;
  const diagonalBottomRight =
    y < maxInArray && x + 1 <= maxInLine ? [x + 1, y + 1, data[y + 1][x + 1]] : undefined;

  const nextRowValue = y < maxInArray ? [x, y + 1, data[y + 1][x]] : undefined;
  const previousRowValue = y > 0 ? [x, y - 1, data[y - 1][x]] : undefined;
  const previousValue = x > 0 ? [x - 1, y, data[y][x - 1]] : undefined;
  const nextValue = x < maxInLine ? [x + 1, y, data[y][x + 1]] : undefined;

  // @ts-ignore
  return [
    nextRowValue,
    previousRowValue,
    previousValue,
    nextValue,
    diagonalBottomLeft,
    diagonalBottomRight,
    diagonalUpLeft,
    diagonalUpRight,
  ].filter((f) => f !== undefined);
};

const increaseRow = (point: number) => (point !== 10 ? point + 1 : point);

const newField = (data: number[][]): number[][] => {
  const field = [...data];
  return field.map((row) => row.map(increaseRow));
};

type Point = {
  x: number;
  y: number;
};

const getExplodingSquids = (field: number[][]): Point[] => {
  const squids: Point[] = [];
  for (let y = 0; y < field.length; y++) {
    const row: number[] = field[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 10) {
        squids.push({ x, y });
      }
    }
  }

  return squids;
};

const explodeSquids = (field: number[][], squids: Point[]) => {
  const data: number[][] = [...field];

  squids.forEach((squid) => {
    const { x, y } = squid;
    data[y][x] = 0;
    const adjacentFields = getAdjacentPointWithCoordinates(squid.x, squid.y, data).filter(
      (f) => f[2] !== 10 && f[2] !== 0,
    );

    adjacentFields.forEach((point) => {
      data[point[1]][point[0]] = data[point[1]][point[0]] + 1;
    });
  });

  return data;
};

const fieldStillHasExplosions = (field: number[][]): boolean =>
  field.reduce((hasExplosions, nextRow): boolean => {
    return hasExplosions || nextRow.includes(10);
  }, false as boolean);

type ExplosionOutput = {
  field: number[][];
  flashes: number;
};

const calculateExplosions = (input: number[][], flashes: number = 0): ExplosionOutput => {
  const data = [...input];
  const squids = getExplodingSquids(data);
  const fieldsAfterExplosion = explodeSquids(data, squids);

  if (fieldStillHasExplosions(fieldsAfterExplosion)) {
    return calculateExplosions(fieldsAfterExplosion, flashes + squids.length);
  }

  return { field: fieldsAfterExplosion, flashes: flashes + squids.length };
};

const partOne = (data: number[][], runs: number, run = 1, flashes = 0): number => {
  const field = newField(data);
  const nextField = calculateExplosions(field);
  const totalExplosions = flashes + nextField.flashes;
  if (run < runs) {
    return partOne(nextField.field, runs, run + 1, totalExplosions);
  }

  return totalExplosions;
};

const allExploded = (data: number[][]): boolean => {
  return data.map((x) => x.every((y) => y === 0)).every((x) => x);
};

const partTwo = (data: number[][], run = 1): number => {
  const field = newField(data);
  const nextField = calculateExplosions(field).field;

  if (!allExploded(nextField)) {
    return partTwo(nextField, run + 1);
  }

  return run;
};

const main = async () => {
  const data = await loadData();

  console.log('P1:', partOne(data, 100));
  console.log('P2:', partTwo(data));
};

main();
