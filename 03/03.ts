import fs from 'fs/promises';

type CountObject = {
  [key: number]: number;
};

const createCounts = (n: number[]) =>
  n.reduce((countObject, currentValue): CountObject => {
    countObject[currentValue] = countObject.hasOwnProperty(currentValue)
      ? countObject[currentValue] + 1
      : 1;
    return countObject;
  }, {} as CountObject);

const getLeastCommonNumber = (n: number[]): number => {
  const counts = createCounts(n);

  return Object.keys(counts)
    .map(Number)
    .reduce((a, b) => (counts[a] < counts[b] ? a : b));
};

const getMostCommonNumber = (n: number[]): number => {
  const counts = createCounts(n);
  return Object.keys(counts)
    .map(Number)
    .reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

type ItemMap = {
  [key: number]: number[];
};

const createDataMap = (data: string[]): ItemMap => {
  return data.reduce((currentValue, next) => {
    for (let i = 0; i < next.length; i++) {
      const value = Number(next.charAt(i));
      if (currentValue.hasOwnProperty(i)) {
        currentValue[i].push(value);
      } else {
        currentValue[i] = [value];
      }
    }

    return currentValue;
  }, {} as ItemMap);
};

const parseInput = async (): Promise<string[]> => {
  const input = await fs.readFile('./input.txt');
  return input.toString().split('\n');
};

const fromBinary = (input: number[]): number => parseInt(input.join(''), 2);

const partOne = (input: string[]) => {
  const data = createDataMap(input);

  const values = Object.values(data).map(getMostCommonNumber);
  const least = Object.values(data).map(getLeastCommonNumber);

  const gamma = fromBinary(values);
  const epsilon = fromBinary(least);

  return gamma * epsilon;
};

const getCO2 = (input: string[], startsWith = '', index = 0): string => {
  const data = createDataMap(input);
  const count = createCounts(data[index]);

  let b = count[0] === count[1] ? 0 : count[1] > count[0] ? 0 : 1;

  const filter = startsWith + b;
  const items = input.filter(f => f.startsWith(filter));

  if (items.length === 1) {
    return items[0];
  }

  return getCO2(items, filter, index +1)
}

const getOxy = (input: string[], startsWith = '', index = 0): string => {
  const data = createDataMap(input);
  const count = createCounts(data[index]);

  let b = count[0] === count[1] ? 1 : count[1] > count[0] ? 1 : 0;

  const filter = startsWith + b;
  const items = input.filter(f => f.startsWith(filter));

  if (items.length === 1) {
    return items[0];
  }

  return getOxy(items, filter, index +1)
}


const partTwo = (input: string[]) => {
  const co2 = parseInt(getCO2(input), 2);
  const oxy = parseInt(getOxy(input), 2);

  return co2 * oxy;
};

const main = async () => {
  const dataMap = await parseInput();
  console.log(partOne(dataMap));
  console.log(partTwo(dataMap));
};

main();
