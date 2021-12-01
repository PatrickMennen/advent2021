import fs from 'fs/promises';
import { pipe, aperture, filter, prop, map, sum } from 'ramda';

const countTotal = pipe(
  aperture(2),
  filter((pred) => {
    if (Array.isArray(pred)) {
      return pred[1] > pred[0];
    }
    return false;
  }),
  prop('length'),
);

const countWindowedTotal = pipe(map(Number), aperture(3), map(sum), countTotal);

const solutionOne = async (): Promise<void> => {
  const input = await fs.readFile('./input.txt');
  const points = input
    .toString()
    .split('\n')
    .map((input) => Number(input));
  console.log(`Part 1: `, countTotal(points));
  console.log(`Part 2: `, countWindowedTotal(points));
};

const main = async () => {
  await solutionOne();
};

main();
