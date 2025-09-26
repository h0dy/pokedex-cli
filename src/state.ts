import { getCommands } from "./commands.js";
import { createInterface, type Interface } from "readline";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};
export type State = {
  commands: Record<string, CLICommand>;
  readline: Interface;
};

export const initState = (): State => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "pokedex > ",
  });
  return {
    commands: getCommands(),
    readline: rl,
  };
};
