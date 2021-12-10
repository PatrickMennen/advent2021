import fs from 'fs/promises';

const loadData = async (): Promise<string[][][]> => {
  const input = await fs.readFile('./input.txt');

  const lines = input.toString().split('\n');
  return lines.map((l) => {
    const outputs = l.split(' | ');
    return outputs.map((n) => n.split(' '));
  });
};

const createOrIncrease = (map: Map<number, number>, n: number) => {
  const current = map.get(n) ?? 0;
  map.set(n, current + 1);
};

const createIndex = (input: string[]): string[] => {
  const index: number[] = new Array(10);
  const randomInput = sortArray(input);

  index[1] = randomInput.findIndex((p) => p.length === 2);
  index[4] = randomInput.findIndex((p) => p.length === 4);
  index[7] = randomInput.findIndex((p) => p.length === 3);
  index[8] = randomInput.findIndex((p) => p.length === 7);

  index[3] = randomInput.findIndex(
    (p) => p.length === 5 && randomInput[index[7]].every((i: string) => p.includes(i)),
  );

  index[9] = randomInput.findIndex(
    (p) => p.length === 6 && randomInput[index[4]].every((i: string) => p.includes(i)),
  );
  index[5] = randomInput.findIndex(
    (p, i) =>
      p.length === 5 && p.every((x) => randomInput[index[9]].includes(x)) && !index.includes(i),
  );

  index[2] = randomInput.findIndex((p, i) => p.length === 5 && !index.includes(i));

  index[6] = randomInput.findIndex(
    (p, i) =>
      p.length === 6 && randomInput[index[5]].every((x) => p.includes(x)) && !index.includes(i),
  );

  index[0] = randomInput.findIndex((p, i) => p.length === 6 && !index.includes(i));

  return index.map((i) => randomInput[i].join(''));
};

const sortArray = (strings: string[]) => strings.map((v) => v.split('').sort());

const mapHardNumbers = (strings: string[][]) => {
  const orderedMap = createIndex(strings[0]);
  const outputs = sortArray(strings[1]);

  return outputs.map((f) => orderedMap.indexOf(f.join(''))).join('');
};

const mapEasyNumbers = (strings: string[], map: Map<number, number>) => {
  const easyStrings = strings.filter((f) => f.length !== 5);

  easyStrings.forEach((f) => {
    switch (f.length) {
      case 2:
        createOrIncrease(map, 1);
        break;

      case 3:
        createOrIncrease(map, 7);
        break;

      case 4:
        createOrIncrease(map, 4);
        break;

      case 7:
        createOrIncrease(map, 8);
        break;
    }
  });

  return map;
};

const part1 = (input: string[][][]) => {
  const map = new Map<number, number>();
  input.forEach((f) => {
    mapEasyNumbers(f[1], map);
  });

  return Array.from(map.values()).reduce((x, y) => x + y);
};

const part2 = (input: string[][][]) => {
  return input.reduce((previous, next): number => {
    return previous + Number(mapHardNumbers(next));
  }, 0);
};

const main = async () => {
  const data = await loadData();
  console.log(part1(data));
  console.log(part2(data));
};

main();
