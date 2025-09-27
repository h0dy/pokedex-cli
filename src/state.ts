import { getCommands } from "./commands.js";
import { createInterface, type Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
  commands: Record<string, CLICommand>;
  readline: Interface;
  pokeAPI: PokeAPI;
  nextLocationsURL: string;
  prevLocationsURL: string;
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
    pokeAPI: new PokeAPI(),
    nextLocationsURL: "",
    prevLocationsURL: "",
  };
};
