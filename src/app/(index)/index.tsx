import * as AC from '@bacons/apple-colors';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import PokemonCard from '@/components/pokemon-card';
import { fetchPokemonList } from '@/services/pokemon';

export default function IndexRoute() {
  const [pokemon, setPokemon] = useState<Array<{ id: number; name: string }>>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPokemon();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = pokemon.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toString().includes(search)
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemon);
    }
  }, [search, pokemon]);

  async function loadPokemon() {
    try {
      const data = await fetchPokemonList(151);
      setPokemon(data);
      setFilteredPokemon(data);
    } catch (error) {
      console.error('Failed to load Pokemon:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue as any} />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredPokemon}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentInsetAdjustmentBehavior="automatic"
      style={{
        backgroundColor: AC.systemBackground as any,
      }}
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
      columnWrapperStyle={{
        gap: 16,
      }}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <PokemonCard id={item.id} name={item.name} />
        </View>
      )}
      ListEmptyComponent={
        <Text
          style={{
            textAlign: 'center',
            color: AC.secondaryLabel as any,
            marginTop: 32,
            fontSize: 16,
          }}
        >
          No Pokemon found
        </Text>
      }
    />
  );
}
