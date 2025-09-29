import { State } from "./state.js";

export const startREPL = async (state: State) => {
  state.readline.prompt();

  state.readline.on("line", async (input) => {
    const words = cleanInput(input);
    if (words.length < 1) {
      state.readline.prompt();
      return;
    }
    const cmdName = words[0];
    const args = words.slice(1);
    const cmd = state.commands[cmdName];

    if (!cmd) {
      console.log(
        `Unknown command: "${cmdName}". Type "help" for a list of commands.`
      );
      state.readline.prompt();
      return;
    }

    try {
      await cmd.callback(state, ...args);
    } catch (error) {
      console.log((error as Error).message);
    }
    state.readline.prompt();
  });
};

export const cleanInput = (input: string): string[] => {
  return input
    .toLowerCase()
    .trim()
    .split(" ")
    .filter((word) => word !== "");
};
