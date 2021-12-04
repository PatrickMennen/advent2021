import fs from 'fs/promises';
import * as A from 'fp-ts/Array';

type Row = {
  number: number;
  completed: boolean;
};

class Board {
  private rows: Row[][];
  private allNumbers: number[];
  private isCompleted: boolean;

  constructor(private numbers: number[][]) {
    this.isCompleted = false;
    this.rows = numbers.map((n) => n.map((l) => ({ number: l, completed: false })));
    this.allNumbers = numbers.flat(1);
  }

  private horizontalBingo() {
    const hasHorizontalCompletion = this.rows.map((r) => {
      const completed = r.filter((f) => f.completed);
      return completed.length === r.length;
    });

    return hasHorizontalCompletion.includes(true);
  }

  private verticalBingo(index = 0): boolean {
    const allItems = this.rows.map((row) =>
      row.filter((item, itemIndex) => item.completed && index === itemIndex),
    );
    const nonEmpty = allItems.filter((f) => f.length !== 0);

    if (nonEmpty.length === 5) {
      return true;
    }

    if (index < 4) {
      return this.verticalBingo(index + 1);
    }

    return false;
  }

  private hasBingo = () => {
    return this.horizontalBingo() || this.verticalBingo();
  };

  private calculateScore(n: number): number {
    const allUnmarked = this.rows.flatMap((r) =>
      r.filter((n) => n.completed === false).map((n) => n.number),
    );

    if (allUnmarked.length === 0) {
      return 0;
    }

    return n * allUnmarked.reduce((prev, next) => prev + next);
  }

  private complete(n: number): number | null {
    this.rows = this.rows.map((row) =>
      row.map((point) => ({ ...point, completed: n === point.number ? true : point.completed })),
    );

    if (this.hasBingo()) {
      this.isCompleted = true;
      return this.calculateScore(n);
    }

    return null;
  }

  roll(ball: number): number | null {
    if (this.allNumbers.includes(ball) && !this.isCompleted) {
      return this.complete(ball);
    }

    return null;
  }
}

const parseInput = async (): Promise<string[]> => {
  const input = await fs.readFile('./input.txt');
  return input.toString().split('\n');
};

const filterEmptyLinesAndDraws = (input: string[]): number[][] => {
  return input
    .filter((f, index) => !(!f || index === 0))
    .map((line) =>
      line
        .split(' ')
        .filter((f) => f !== '')
        .map((r) => Number(r)),
    );
};

const getBoards = (input: string[]): Board[] => {
  const boards = filterEmptyLinesAndDraws(input);
  const groupedBoards = A.chunksOf(5)(boards);

  return groupedBoards.map((board) => new Board(board));
};

const getDraws = (input: string[]) => {
  return input[0].split(',').map((n) => Number(n));
};

const main = async () => {
  const input = await parseInput();
  const draws = getDraws(input);
  const boards = getBoards(input);

  const results: number[] = [];

  draws.forEach((d) => {
    boards.forEach((board) => {
      const result = board.roll(d);
      if (result) {
        results.push(result);
      }
    });
  });

  console.log('P1:', results[0]);
  console.log('P2:', results[boards.length - 1]);
};

main();
