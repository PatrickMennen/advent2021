import fs from 'fs/promises';

const loadData = async (): Promise<number[]> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split(',')
    .map((l) => Number(l));
};

class Fish {
  constructor(private days: number = 8) {}

  public breed(): Fish | null {
    this.days = this.days - 1;

    if (this.days < 0) {
      this.days = 6;
      return new Fish();
    }

    return null;
  }
}

const newFishMap = (): Map<number, number> => {
  const fishMap = new Map<number, number>();
  for (let i = 0; i <= 8; i++) {
    fishMap.set(i, 0);
  }

  return fishMap;
};

const groupFish = (fish: number[]): Map<number, number> => {
  const fishMap = newFishMap();

  fish.forEach((f) => {
    const totalFish = fishMap.get(f)!;
    fishMap.set(f, totalFish + 1);
  });

  return fishMap;
};

const breedGrouped = (fish: Map<number, number>, daysLeft: number = 0): Map<number, number> => {
  const newFish = newFishMap();

  if (daysLeft > 0) {
    const fishPerElement = Array.from(fish.entries()).reverse();
    fishPerElement.forEach(([key, value]) => {
      if (key === 0) {
        const val = newFish.get(6) ?? 0;
        newFish.set(8, value);
        newFish.set(6, value + val);
      } else {
        newFish.set(key - 1, value);
      }
    });

    return breedGrouped(newFish, daysLeft - 1);
  }

  return fish;
};

const breedFish = (fish: Fish[], daysLeft: number = 0): Fish[] => {
  const newFish = [...fish];

  if (daysLeft !== 0) {
    fish.forEach((f) => {
      const bredFish = f.breed();
      if (bredFish) {
        newFish.push(bredFish);
      }
    });

    return breedFish(newFish, daysLeft - 1);
  }

  return newFish;
};

const main = async () => {
  const input = await loadData();

  const fish = input.map((daysLeft) => new Fish(daysLeft));
  console.log(breedFish(fish, 80).length);
  const p2 = Array.from(breedGrouped(groupFish(input), 256).values());
  console.log(p2.reduce((x, y) => x + y));
};

main();
