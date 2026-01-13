import * as AC from '@bacons/apple-colors';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { fetchPokemonDetails, getTypeColor, Pokemon } from '@/services/pokemon';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPokemon(parseInt(id, 10));
    }
  }, [id]);

  async function loadPokemon(pokemonId: number) {
    try {
      const data = await fetchPokemonDetails(pokemonId);
      setPokemon(data);
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

  if (!pokemon) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <Text style={{ color: AC.secondaryLabel as any }}>Pokemon not found</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0];
  const typeColor = getTypeColor(primaryType);

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          headerLargeTitle: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          flex: 1,
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 32,
            experimental_backgroundImage: `linear-gradient(to bottom, ${typeColor}33, transparent)` as any,
          }}
        >
          <Image
            source={{ uri: pokemon.sprite }}
            style={{
              width: 200,
              height: 200,
            }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 14,
              color: AC.secondaryLabel as any,
              marginTop: 8,
            }}
          >
            #{pokemon.id.toString().padStart(3, '0')}
          </Text>
        </View>

        <View style={{ padding: 20, gap: 24 }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: AC.secondaryLabel as any,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Types
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {pokemon.types.map((type) => (
                <View
                  key={type}
                  style={{
                    backgroundColor: getTypeColor(type),
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: AC.secondaryLabel as any,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              About
            </Text>
            <View
              style={{
                backgroundColor: AC.secondarySystemBackground as any,
                borderRadius: 12,
                borderCurve: 'continuous',
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  color: AC.label as any,
                }}
              >
                {pokemon.description}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: AC.secondaryLabel as any,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Height
              </Text>
              <View
                style={{
                  backgroundColor: AC.secondarySystemBackground as any,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: AC.label as any,
                  }}
                >
                  {(pokemon.height / 10).toFixed(1)}m
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: AC.secondaryLabel as any,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Weight
              </Text>
              <View
                style={{
                  backgroundColor: AC.secondarySystemBackground as any,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: AC.label as any,
                  }}
                >
                  {(pokemon.weight / 10).toFixed(1)}kg
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: AC.secondaryLabel as any,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Base Stats
            </Text>
            <View
              style={{
                backgroundColor: AC.secondarySystemBackground as any,
                borderRadius: 12,
                borderCurve: 'continuous',
                padding: 16,
                gap: 12,
              }}
            >
              <StatBar label="HP" value={pokemon.stats.hp} color="#FF5959" />
              <StatBar label="Attack" value={pokemon.stats.attack} color="#F5AC78" />
              <StatBar label="Defense" value={pokemon.stats.defense} color="#FAE078" />
              <StatBar label="Sp. Atk" value={pokemon.stats.specialAttack} color="#9DB7F5" />
              <StatBar label="Sp. Def" value={pokemon.stats.specialDefense} color="#A7DB8D" />
              <StatBar label="Speed" value={pokemon.stats.speed} color="#FA92B2" />
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: AC.secondaryLabel as any,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Abilities
            </Text>
            <View
              style={{
                backgroundColor: AC.secondarySystemBackground as any,
                borderRadius: 12,
                borderCurve: 'continuous',
                padding: 16,
                gap: 8,
              }}
            >
              {pokemon.abilities.map((ability) => (
                <Text
                  key={ability}
                  style={{
                    fontSize: 15,
                    color: AC.label as any,
                    textTransform: 'capitalize',
                  }}
                >
                  • {ability.replace('-', ' ')}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxStat = 255;
  const percentage = (value / maxStat) * 100;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text
        style={{
          width: 70,
          fontSize: 13,
          fontWeight: '600',
          color: AC.secondaryLabel as any,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          width: 35,
          fontSize: 13,
          fontWeight: '600',
          color: AC.label as any,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: AC.tertiarySystemBackground as any,
          borderRadius: 4,
          borderCurve: 'continuous',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}
