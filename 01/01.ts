import fs from "fs/promises";
import * as R from 'ramda';

const countTotal = R.pipe(
    R.aperture(2),
    R.filter((pred) => {
        if (Array.isArray(pred)) {
            return pred[1] > pred[0];
        }
        return false;
    }),
    R.prop('length')
);

const countWindowedTotal = R.pipe(
    R.map(Number),
    R.aperture(3),
    R.map(R.sum),
    countTotal
)

const solutionOne = async (): Promise<void> =>  {
    const input = await fs.readFile('./input.txt');
    const points = input.toString().split('\n').map(input => Number(input));
    console.log(`Part 1: `, countTotal(points))
    console.log(`Part 2: `, countWindowedTotal(points));
}

const main = async () => {
    await solutionOne();
}

main();
