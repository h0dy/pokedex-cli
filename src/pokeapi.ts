import { PokeCache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private pokeapiCache: PokeCache;

  constructor(interval: number) {
    this.pokeapiCache = new PokeCache(interval);
  }

  closeCache() {
    this.pokeapiCache.stopReapLoop();
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    const cachedLocations = this.pokeapiCache.get<ShallowLocations>(url);
    if (cachedLocations) {
      return cachedLocations;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      let locations: ShallowLocations = await res.json();
      this.pokeapiCache.add(url, locations);
      return locations;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching locations: ${error.message}`);
      }
      throw new Error("Unknown error fetching locations");
    }
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    const cachedLocation = this.pokeapiCache.get<Location>(url);
    if (cachedLocation) {
      return cachedLocation;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      let location: Location = await res.json();
      this.pokeapiCache.add(url, location);
      return location;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching a location: ${error.message}`);
      }
      throw new Error("Unknown error fetching a location");
    }
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;

    const cachedPokemon = this.pokeapiCache.get<Pokemon>(url);
    if (cachedPokemon) {
      return cachedPokemon;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      let pokemon: Pokemon = await res.json();
      this.pokeapiCache.add(url, pokemon);
      return pokemon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching a Pokemon: ${error.message}`);
      }
      throw new Error("Unknown error fetching a Pokemon");
    }
  }
}

export type ShallowLocations = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

export type Location = {
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  game_index: number;
  id: number;
  location: {
    name: string;
    url: string;
  };
  name: string;
  names: {
    language: {
      name: string;
      url: string;
    };
    name: string;
  }[];
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
    version_details: {
      encounter_details: {
        chance: number;
        condition_values: any[];
        max_level: number;
        method: {
          name: string;
          url: string;
        };
        min_level: number;
      }[];
      max_chance: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
};

export type Pokemon = {
  abilities: Ability[];
  base_experience: number;
  cries: Cries;
  forms: Species[];
  game_indices: GameIndex[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  past_abilities: PastAbility[];
  past_types: any[];
  species: Species;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
};

export type Ability = {
  ability: Species | null;
  is_hidden: boolean;
  slot: number;
};

export type Species = {
  name: string;
  url: string;
};

export type Cries = {
  latest: string;
  legacy: string;
};

export type GameIndex = {
  game_index: number;
  version: Species;
};

export type HeldItem = {
  item: Species;
  version_details: VersionDetail[];
};

export type VersionDetail = {
  rarity: number;
  version: Species;
};

export type Move = {
  move: Species;
  version_group_details: VersionGroupDetail[];
};

export type VersionGroupDetail = {
  level_learned_at: number;
  move_learn_method: Species;
  order: number | null;
  version_group: Species;
};

export type PastAbility = {
  abilities: Ability[];
  generation: Species;
};

export type GenerationV = {
  "black-white": Sprites;
};

export type GenerationIv = {
  "diamond-pearl": Sprites;
  "heartgold-soulsilver": Sprites;
  platinum: Sprites;
};

export type Versions = {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
  "generation-iii": GenerationIii;
  "generation-iv": GenerationIv;
  "generation-v": GenerationV;
  "generation-vi": { [key: string]: Home };
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
};

export type Other = {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
  showdown: Sprites;
};

export type Sprites = {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: null | string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  other?: Other;
  versions?: Versions;
  animated?: Sprites;
};

export type GenerationI = {
  "red-blue": RedBlue;
  yellow: RedBlue;
};

export type RedBlue = {
  back_default: string;
  back_gray: string;
  back_transparent: string;
  front_default: string;
  front_gray: string;
  front_transparent: string;
};

export type GenerationIi = {
  crystal: Crystal;
  gold: Gold;
  silver: Gold;
};

export type Crystal = {
  back_default: string;
  back_shiny: string;
  back_shiny_transparent: string;
  back_transparent: string;
  front_default: string;
  front_shiny: string;
  front_shiny_transparent: string;
  front_transparent: string;
};

export type Gold = {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  front_transparent?: string;
};

export type GenerationIii = {
  emerald: OfficialArtwork;
  "firered-leafgreen": Gold;
  "ruby-sapphire": Gold;
};

export type OfficialArtwork = {
  front_default: string;
  front_shiny: string;
};

export type Home = {
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
};

export type GenerationVii = {
  icons: DreamWorld;
  "ultra-sun-ultra-moon": Home;
};

export type DreamWorld = {
  front_default: string;
  front_female: null | string;
};

export type GenerationViii = {
  icons: DreamWorld;
};

export type Stat = {
  base_stat: number;
  effort: number;
  stat: Species;
};

export type Type = {
  slot: number;
  type: Species;
};
