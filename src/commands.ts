import type { CLICommand, State } from "./state.js";

export const commandExit = async (state: State) => {
  console.log("Closing the Pokedex... Goodbye!");
  state.readline.close();
  process.exit(0);
};

export const commandHelp = async (state: State) => {
  console.log(`
Welcome to the Pokedex!
Usage:
    `);
  Object.values(state.commands).forEach((cmd) => {
    console.log(`${cmd.name}: ${cmd.description}`);
  });
};

export const commandMap = async (state: State) => {
  const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);

  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;

  for (let location of locations.results) {
    console.log(location.name);
  }
};

export const commandMapb = async (state: State) => {
  if (!state.prevLocationsURL) {
    console.error("you're on the first page, use map command");
    return;
  }

  const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);

  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;

  for (let location of locations.results) {
    console.log(location.name);
  }
};

export const commandExplore = async (state: State, ...args: string[]) => {
  if (args.length < 1) {
    console.error("Please make sure to provide a location name");
    return;
  }

  const locationName = args[0];
  console.log(`Exploring ${locationName}...`);

  const locationInfo = await state.pokeAPI.fetchLocation(locationName);
  console.log("Found Pokemon:")

  for (let { pokemon } of locationInfo.pokemon_encounters) {
    console.log(` - ${pokemon.name}`);
  }
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
    map: {
      name: "map",
      description:
        "Displays the names/next names of 20 location areas in the Pokemon world",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description:
        "Displays the names/previous names of 20 location areas in the Pokemon world",
      callback: commandMapb,
    },
    explore: {
      name: "explore <location-name>",
      description: "list all the Pokémon located in an area",
      callback: commandExplore,
    },
  };
};
