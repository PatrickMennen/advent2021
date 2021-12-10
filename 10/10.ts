import * as R from 'ramda';
import fs from 'fs/promises';

const loadData = async (): Promise<string[]> => {
  const input = await fs.readFile('./input.txt');
  return input.toString().split('\n');
}

const closingBrackets = new Map<string, string>([
  ['{', '}'],
  ['<', '>'],
  ['(', ')'],
  ['[', ']'],
]);

const points = new Map<string, number>([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
]);

const autoCompletePoints = new Map<string, number>([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
]);

const isValidOpenBracket = (char: string) => {
  const validOpenBrackets = ['{', '<', '(', '['];
  return validOpenBrackets.includes(char);
};

const isValidClosingBracket = (char: string) => {
  const validClosingBrackets = ['}', '>', ')', ']'];
  return validClosingBrackets.includes(char);
};

const matchBracket = (input: string, openBrackets: string[] = [], index: number = 0, total = 0): { count: number, openBrackets: string[] } => {
  const validate = input.charAt(0);

  if (isValidClosingBracket(validate)) {
    const match = R.takeLast(1, openBrackets)[0];
    const isMatch = validate === closingBrackets.get(match);

    if (openBrackets.length === 0 || !isMatch) {
      return { count: points.get(validate)!, openBrackets };
    }

    openBrackets.pop();
  } else if (isValidOpenBracket(validate)) {
    openBrackets.push(validate);
  }

  const remainder = R.takeLast(input.length -1, input);
  if (remainder && total === 0) {
    return matchBracket(remainder, openBrackets, index + 1, total);
  }

  return { count: total, openBrackets };
};

const closeBrackets = (next: string[]): number => {
  const closingStrings = next.reverse().map(c => closingBrackets.get(c));

  return closingStrings.reduce((x, y): number => {
    return (x * 5) + autoCompletePoints.get(y!)!;
  }, 0);
}

const main = async () => {
  const data = await loadData();

  const parsed = data.map(l => matchBracket(l));
  const counts = parsed.map(p => p.count).reduce((x, y) => x + y);

  const incomplete = parsed.filter(f => f.count === 0);

  const autoCompleteScores = incomplete.map(f => {
    return closeBrackets(f.openBrackets);
  }).sort((x, y) => x > y ? 1 : -1);

  const index = Math.floor(autoCompleteScores.length / 2);

  console.log('P1: %d', counts);
  console.log('P2: %d', autoCompleteScores[index]);
}

main();
