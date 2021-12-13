import fs from 'fs/promises';
import { start } from 'repl';

const loadData = async (): Promise<Graph> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split('\n')
    .map((line) => line.split('-'))
    .reduce((graph: Graph, [source, destination]) => {
      if (!(source in graph)) graph[source] = [];
      graph[source].push(destination);

      if (!(destination in graph)) graph[destination] = [];
      graph[destination].push(source);

      return graph;
    }, {});
};

const isBigCave = (char: string): boolean => char.toUpperCase() === char;

type Graph = Record<string, string[]>;

const traverse = (graph: Graph, current: string, currentPath: string[] = [], paths: string[][] = []) => {
  const nextPoints = graph[current];

  if (!isBigCave(current) && currentPath.filter((p) => p === current).length >= 1) {
    return;
  }

  if (current === 'end') {
    paths.push(currentPath.concat('end'));
    return;
  }

  nextPoints.forEach((n) => traverse(graph, n, currentPath.concat(current), paths));
};

const traverse2 = (
  graph: Graph,
  allow: boolean,
  current: string,
  currentPath: string[] = [],
  paths: string[][] = [],
) => {
  let allowCurrentPath = allow;
  const nextPoints = graph[current];

  if (!isBigCave(current) && currentPath.filter((c) => c === current).length >= 1) {
    if (!allowCurrentPath) return;
    allowCurrentPath = false;
  }

  if (current === 'start' && currentPath.includes('start')) {
    return;
  }

  if (current === 'end') {
    paths.push(currentPath.concat('end'));
    return;
  }

  nextPoints.forEach((n) => traverse2(graph, allowCurrentPath, n, currentPath.concat(current), paths));
};

const partOne = (graph: Graph) => {
  const paths: string[][] = [];
  traverse(graph, 'start', [], paths);

  return paths.length;
};

const partTwo = (graph: Graph) => {
  const paths: string[][] = [];
  traverse2(graph, true, 'start', [], paths);

  return paths.length;
};

const main = async () => {
  const data = await loadData();
  console.log(partOne(data));
  console.log(partTwo(data));
};

main();
