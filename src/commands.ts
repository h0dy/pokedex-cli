import type { CLICommand, State } from "./state.js";

export const commandExit = (state: State) => {
  console.log("Closing the Pokedex... Goodbye!");
  state.readline.close();
  process.exit(0);
};

export const commandHelp = (state: State) => {
  console.log(`
Welcome to the Pokedex!
Usage:
    `);
  Object.values(state.commands).forEach((cmd) => {
    console.log(`${cmd.name}: ${cmd.description}`);
  });
};

export const getCommands = (): Record<string, CLICommand> => {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Display help message",
      callback: commandHelp,
    },
  };
};
