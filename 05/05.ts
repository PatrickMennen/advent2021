import fs from 'fs/promises';

type Point = {
  x: number;
  y: number;
};

const loadData = async (): Promise<string[]> => {
  const input = await fs.readFile('./input.txt');
  return input.toString().split('\n');
};

const convertCoordinate = (line: string) => {
  const coordinates = line.split(' -> ');
  return coordinates
    .map((point: string) => {
      return point.split(',').map((n) => Number(n));
    })
    .map((p) => ({ x: p[0], y: p[1] }));
};

const createOrIncreaseAmount = (map: Map<string, number>, x: number, y: number) => {
  const combinedCoordinate = `${x},${y}`;

  const currentAmount = map.get(combinedCoordinate);
  if (!currentAmount) {
    map.set(combinedCoordinate, 1);
  } else {
    map.set(combinedCoordinate, currentAmount + 1);
  }
};

const addVerticalCoordinates = (map: Map<string, number>, points: Point[]) => {
  const diffVertical = Math.abs(points[0].y - points[1].y);
  const maxVertical = Math.max(points[0].y, points[1].y);
  const verticalStart = maxVertical - diffVertical;

  const startX = points[0].y === verticalStart ? points[0].x : points[1].x;
  const maxX = Math.max(points[0].x, points[1].x);
  const direction = maxX === startX ? 'down' : 'up';

  let offset = 0;
  for (let y = verticalStart; y <= maxVertical; y++) {
    const x = direction === 'up' ? startX + offset : maxX - offset;
    offset++;

    createOrIncreaseAmount(map, x, y);
  }
};

const addCoordinates = (map: Map<string, number>, points: Point[]) => {
  const highestX = Math.max(points[0].x, points[1].x);
  const lowestX = Math.min(points[0].x, points[1].x);
  const highestY = Math.max(points[0].y, points[1].y);
  const lowestY = Math.min(points[0].y, points[1].y);

  if (points[0].x === points[1].x) {
    const end = highestY - lowestY;
    for (let i = end; i >= 0; i--) {
      createOrIncreaseAmount(map, points[0].x, highestY - i);
    }
  }

  if (points[0].y === points[1].y) {
    const end = highestX - lowestX;

    for (let i = end; i >= 0; i--) {
      createOrIncreaseAmount(map, highestX - i, points[0].y);
    }
  }
};

const partOnePoints = (map: Map<string, number>, line: string): Map<string, number> => {
  const coordinates = convertCoordinate(line);
  if (coordinates[0].x === coordinates[1].x || coordinates[0].y === coordinates[1].y) {
    addCoordinates(map, coordinates);
  }

  return map;
};

const partTwoPoints = (map: Map<string, number>, line: string): Map<string, number> => {
  const coordinates = convertCoordinate(line);

  if (coordinates[0].x === coordinates[1].x || coordinates[0].y === coordinates[1].y) {
    partOnePoints(map, line);
  } else {
    addVerticalCoordinates(map, coordinates);
  }

  return map;
};

const partOne = (data: string[]) => {
  const map = new Map<string, number>();

  return data.reduce((currentMap, nextValue) => {
    return partOnePoints(currentMap, nextValue);
  }, map);
};

const partTwo = (data: string[]) => {
  const map = new Map<string, number>();

  return data.reduce((currentMap, nextValue) => {
    return partTwoPoints(currentMap, nextValue);
  }, map);
};

const main = async () => {
  const data = await loadData();
  const p1 = Array.from(partOne(data).values()).filter((f) => f >= 2);
  const p2 = Array.from(partTwo(data).values()).filter((f) => f >= 2);
  console.log('P1:', p1.length);
  console.log('P2:', p2.length);
};

main();
