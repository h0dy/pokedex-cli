import { createInterface } from "readline";
import { getCommands } from "./commands.js";

export const startREPL = () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "pokedex > ",
  });

  rl.prompt();

  rl.on("line", async (input) => {
    const words = cleanInput(input);
    if (words.length < 1) {
      rl.prompt();
      return;
    }
    const cmdName = words[0];
    const cmd = getCommands()[cmdName];

    if (!cmd) {
      console.log(
        `Unknown command: "${cmdName}". Type "help" for a list of commands.`
      );
      rl.prompt();
      return;
    }

    try {
      cmd.callback(getCommands());
    } catch (error) {
      console.log(error);
    }
    rl.prompt();
  });
};

export const cleanInput = (input: string): string[] => {
  return input
    .toLowerCase()
    .trim()
    .split(" ")
    .filter((word) => word !== "");
};
