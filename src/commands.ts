import { stat } from "fs";
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
  console.log("Found Pokemon:");

  for (let { pokemon } of locationInfo.pokemon_encounters) {
    console.log(` - ${pokemon.name}`);
  }
};

export const commandCatch = async (state: State, ...args: string[]) => {
  if (args.length < 1) {
    console.error("Please provide the name of the pokemon");
    return;
  }

  const pokeName = args[0];
  const pokemon = await state.pokeAPI.fetchPokemon(pokeName);
  console.log(`Throwing a Pokeball at ${pokeName}...`);

  const pokeXP = pokemon.base_experience;
  const userXP = Math.floor(Math.random() * 400);
  if (userXP >= pokeXP) {
    console.log(`${pokemon.name} was caught!`);
    console.log(
      "You may now inspect it with the inspect <pokemon-name> command."
    );
    state.pokedex[pokemon.name] = pokemon;
    return;
  }
  console.log(`${pokemon.name} escaped!\nTry again!`);
};

export const commandInspect = async (state: State, ...args: string[]) => {
  if (args.length < 1) {
    console.error("Please provide the name of the pokemon you want to inspect");
    return;
  }

  const pokeName = args[0];
  const pokemon = state.pokedex[pokeName];
  if (!pokemon) {
    console.error(
      `you haven't caught ${pokeName}\ntry "catch ${pokeName}" to try to catch it`
    );
    return;
  }

  console.log(`
Name: ${pokemon.name}
Height: ${pokemon.height}
Weight: ${pokemon.weight}
Stats:`);
  for (let stat of pokemon.stats) {
    console.log(` - ${stat.stat.name}: ${stat.base_stat}`);
  }
  console.log("Types:");
  for (let { type } of pokemon.types) {
    console.log(` - ${type.name}`);
  }
};

export const commandPokedex = async (state: State) => {
  if (Object.keys(state.pokedex).length < 1) {
    console.error("Your pokedex is empty\ntry to catch some pokemon first");
    return;
  }
  console.log("Your pokedex:");
  for (let pokemon of Object.values(state.pokedex)) {
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
    catch: {
      name: "catch <pokemon-name>",
      description: "try to catch a pokemon!!",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect <pokemon-name>",
      description: "inspect your caught pokemon!",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "list all the Pokemon that you have caught",
      callback: commandPokedex,
    },
  };
};
