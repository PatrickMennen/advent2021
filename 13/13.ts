import fs from 'fs/promises';
import * as R from 'ramda';

const loadData = async (): Promise<string[]> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split('\n');
}

const getMaxX = (points: number[][]): number => points.reduce((current, nextPoint) => nextPoint[0] > current ? nextPoint[0] : current, 0);
const getMaxY = (points: number[][]): number => points.reduce((current, nextPoint) => nextPoint[1] > current ? nextPoint[1] : current, 0);

const addPoints = (map: number[][], p: number[]) => {
  const newMap = [...map];
  newMap[p[1]][p[0]] = newMap[p[1]][p[0]] + 1;

  return newMap;
}

const createMap = (points: number[][]): number[][] => {
  const maxX = getMaxX(points) + 1;
  const maxY = getMaxY(points) + 1;

  const outerArray: number[][] = Array(maxY);
  for (let i = 0; i < maxY; i++) {
    outerArray[i] = new Array(maxX).fill(0)
  }

  return points.reduce(addPoints, outerArray)
}

const mapNumbersAndFoldInstructions = (data: string[]) => {
  const foldInstructions = data.filter(f => f.startsWith('fold along ')).map(l => l.replace('fold along ', ''));
  const points = R.takeWhile(r => r !== '', data).map(n => n.split(',').flatMap(p => Number(p)));

  return {
    points: createMap(points),
    foldInstructions
  }
}

const foldLeft = (amount: number, data: number[][]) => {
  const input = [...data];
  const originalData = data.map(row => R.take(amount)(row))
  const foldedData = input.map(row => R.takeLast(amount)(row).reverse());

  const pointsMap = foldedData.flatMap((row, y) => {
    return row.map((value, x) => [value, x]).filter(f => f[0] > 0).map(v => [v[1], y]);
  })

  return pointsMap.reduce(addPoints, originalData);
}

const foldUp = (start: number, data: number[][]) => {
  const input = [...data];

  const foldedData = R.takeLast(start)(input).reverse();
  const pointsMap = foldedData.flatMap((row, y) => {
    return row.map((value, x) => [value, x]).filter(f => f[0] > 0).map(v => [v[1], y]);
  });

  return pointsMap.reduce(addPoints, R.take(start)(input));
}

const partOne = (points: number[][]) => {
  const output = foldLeft(655, points);
  return output.flatMap(p => p.flat()).filter(f => f > 0).length;
}

const createFold = (points: number[][], nextInstruction: string) => {
  const command = nextInstruction.split('=');

  if (command[0] === 'x') {
    return foldLeft(Number(command[1]), points);
  }

  return foldUp(Number(command[1]), points);
}

const partTwo = (points: number[][], instructions: string[]) => {
  console.log('Part 2 -> prepare for awesome ascii art...')

  const p2  = instructions.reduce(createFold, points);
  p2.forEach(line => {
    console.log(line.map(x => x > 0 ? '█': ' ').join(''));
  })

}

const main = async () => {
  const data = await loadData();
  const map = mapNumbersAndFoldInstructions(data);

  console.log('P1:', partOne(map.points));
  partTwo(map.points, map.foldInstructions);
}

main();
