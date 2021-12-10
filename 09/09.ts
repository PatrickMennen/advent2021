import fs from 'fs/promises';
import { tail } from 'ramda';

const loadData = async (): Promise<number[][]> => {
  const input = await fs.readFile('./input.txt');

  return input
    .toString()
    .split('\n')
    .map((s: string) => s.split('').flatMap((j) => Number(j)));
};

const isLower = (
  value: number,
  next?: number,
  previous?: number,
  nextRow?: number,
  previousRow?: number,
) => {
  const filtered = [previous, next, nextRow, previousRow].filter((f) => f !== undefined);

  // @ts-ignore
  return Math.min(value, ...filtered) === value && !filtered.every((x) => x === value);
};

const getPositions = (numbersFromString: number[][]) => {
  const maxInArray = numbersFromString.length - 1;

  const output = [];
  const positions = [];
  for (let i = 0; i < numbersFromString.length; i++) {
    const currentArray = numbersFromString[i];

    for (let j = 0; j < currentArray.length; j++) {
      const maxInCurrentArray = currentArray.length - 1;
      const currentNumber = currentArray[j];

      const nextRowValue = i < maxInArray ? numbersFromString[i + 1][j] : undefined;
      const previousRowValue = i > 0 ? numbersFromString[i - 1][j] : undefined;
      const previousValue = j > 0 ? currentArray[j - 1] : undefined;
      const nextValue = j < maxInCurrentArray ? currentArray[j + 1] : undefined;

      if (isLower(currentNumber, nextValue, previousValue, nextRowValue, previousRowValue)) {
        output.push(currentNumber);
        positions.push([j, i, currentNumber]);
      }
    }
  }

  return { count: output, positions };
};

const isEqualPoint = (p1: number[], p2: number[]) => p1[0] === p2[0] && p1[1] === p2[1];

const getAdjacentPointWithCoordinates = (x: number, y: number, data: number[][]): number[][] => {
  const maxInArray = data.length - 1;
  const maxInLine = data[0].length -1;


  const nextRowValue = y < maxInArray ? [x, y + 1, data[y + 1][x]] : undefined;
  const previousRowValue = y > 0 ? [x, y -1, data[y - 1][x]] : undefined;
  const previousValue = x > 0 ? [x - 1, y, data[y][x - 1]] : undefined;
  const nextValue = x < maxInLine ? [x + 1, y, data[y][x + 1]] : undefined;

  // @ts-ignore
  return [nextRowValue, previousRowValue, previousValue, nextValue].filter(f => f !== undefined);
}

const XYString = (point: number[]) => `${point[0]},${point[1]}`;

const getBasin = (position: number[], data: number[][]) => {
  const processed: number[][] = [];
  const pointsLeft = [position];
  const ignores: string[] = [];

  while (pointsLeft.length) {
    const cp = pointsLeft.shift();
    if (!cp) {
      continue;
    }
    processed.push(cp!);
    ignores.push(XYString(cp!));

    const adj = getAdjacentPointWithCoordinates(cp[0], cp[1], data);

    const todo = adj.filter(f => {
      const point = XYString(f);

      if (isEqualPoint(cp, f)) {
        return false;
      }

      if (pointsLeft.map(f => XYString(f)).includes(point)) {
        return false;
      }

      if (ignores.includes(point)) {
        return false;
      }

      return f[2] < 9;
    });

    pointsLeft.push(...todo);
  }

  return processed;
}


const main = async () => {
  const numbersFromString = await loadData();

  const positions = getPositions(numbersFromString);
  console.log('P1:', positions.count.reduce((x, y) => x + y + 1, 0));

  const basins = positions.positions.map(b => getBasin(b, numbersFromString)).sort((a, b) => a.length > b.length ? 1 : -1);
  const largestBasins = basins.slice(1).slice(-3).map(i => i.length).reduce((p, n) => p * n);
  console.log('P2:', largestBasins);
};

main();
