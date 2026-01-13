export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
  description: string;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: { other: { 'official-artwork': { front_default: string } } };
  height: number;
  weight: number;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
}

interface PokeApiSpecies {
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
}

const cache = new Map<string, any>();

async function fetchWithCache(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}

export async function fetchPokemonList(limit: number = 151): Promise<Array<{ id: number; name: string }>> {
  const data = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  return data.results.map((p: any, index: number) => ({
    id: index + 1,
    name: p.name,
  }));
}

export async function fetchPokemonDetails(id: number): Promise<Pokemon> {
  const [pokemonData, speciesData] = await Promise.all([
    fetchWithCache(`https://pokeapi.co/api/v2/pokemon/${id}`) as Promise<PokeApiPokemon>,
    fetchWithCache(`https://pokeapi.co/api/v2/pokemon-species/${id}`) as Promise<PokeApiSpecies>,
  ]);

  const englishDescription = speciesData.flavor_text_entries
    .find((entry) => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') || '';

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    types: pokemonData.types.map((t) => t.type.name),
    sprite: pokemonData.sprites.other['official-artwork'].front_default,
    height: pokemonData.height,
    weight: pokemonData.weight,
    stats: {
      hp: pokemonData.stats[0].base_stat,
      attack: pokemonData.stats[1].base_stat,
      defense: pokemonData.stats[2].base_stat,
      specialAttack: pokemonData.stats[3].base_stat,
      specialDefense: pokemonData.stats[4].base_stat,
      speed: pokemonData.stats[5].base_stat,
    },
    abilities: pokemonData.abilities.map((a) => a.ability.name),
    description: englishDescription,
  };
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] || '#A8A878';
}
