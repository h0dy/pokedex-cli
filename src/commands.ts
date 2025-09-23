import type { CLICommand } from "./command.js";

export const commandExit = () => {
  console.log("Closing the Pokedex... Goodbye!");
  process.exit(0);
};

export const commandHelp = () => {
  console.log(`
Welcome to the Pokedex!
Usage:
    `);
  Object.values(getCommands()).forEach((cmd) => {
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
