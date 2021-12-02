import fs from 'fs/promises';

type State = {
  x: number;
  y: number;
};

type AimState = State & {
  aim: number;
};

const initialState: State = {
  x: 0,
  y: 0,
};

const initialAimState: AimState = {
  x: 0,
  y: 0,
  aim: 0,
};

type Direction = 'forward' | 'down' | 'up';
type Command = {
  direction: Direction;
  amount: number;
};

const moveWithAim = (command: Command, state: AimState): AimState => {
  switch (command.direction) {
    case 'forward':
      const x = state.x + command.amount;
      const y = state.y + state.aim * command.amount;

      return { x, y, aim: state.aim };

    case 'up':
      return { x: state.x, y: state.y, aim: state.aim - command.amount };

    case 'down':
      return { ...state, aim: state.aim + command.amount };

    default:
      throw new Error('Command not implemented' + command.direction);
  }
};

const move = (command: Command, state: State): State => {
  switch (command.direction) {
    case 'forward':
      return { y: state.y, x: state.x + command.amount };

    case 'up':
      return { y: state.y - command.amount, x: state.x };

    case 'down':
      return { y: state.y + command.amount, x: state.x };

    default:
      throw new Error('Command not implemented' + command.direction);
  }
};

const createCommands = (input: string): Command => {
  const data = input.split(' ');
  return {
    direction: data[0] as Direction,
    amount: Number(data[1]),
  };
};

const parseCommands = async (): Promise<Command[]> => {
  const input = await fs.readFile('./input.txt');
  return input
    .toString()
    .split('\n')
    .map((input) => createCommands(input));
};

const solutionOne = (commands: Command[]) =>
  commands.reduce((previous, next): State => {
    return move(next, previous);
  }, initialState);

const solutionTwo = (commands: Command[]) =>
  commands.reduce((previous, next): AimState => {
    return moveWithAim(next, previous);
  }, initialAimState);

const main = async () => {
  const commands = await parseCommands();

  const partOne = solutionOne(commands);
  const partTwo = solutionTwo(commands);

  console.log('1:', partOne.x * partOne.y);
  console.log('2:', partTwo.x * partTwo.y);
};

main();
