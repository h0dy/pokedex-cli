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

  async fetchLocation(locationName?: string): Promise<Location> {
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
