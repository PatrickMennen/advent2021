import fs from 'fs/promises';

const loadData = async (): Promise<number[]> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split(',')
    .map((l) => Number(l));
};

const calculateFuelCost = (x: number, y: number) => {
  const diff = Math.abs(x - y);
  return (diff * (diff + 1)) / 2;
};

const partTwo = (input: number[]) => {
  const max = Math.max(...input);
  const output = [];
  for (let i = 0; i <= max; i++) {
    const result = input.map((diff) => calculateFuelCost(i, diff)).reduce((x, y) => x + y);
    output.push(result);
  }

  console.log(Math.min(...output));
};

const partOne = (input: number[]) => {
  const max = Math.max(...input);
  const output = [];
  for (let i = 0; i <= max; i++) {
    const result = input.map((diff) => Math.abs(i - diff)).reduce((x, y) => x + y);
    output.push(result);
  }

  console.log(Math.min(...output));
};

const main = async () => {
  const data = await loadData();
  partOne(data);
  partTwo(data);
};

main();
