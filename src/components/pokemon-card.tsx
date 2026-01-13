import * as AC from '@bacons/apple-colors';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface PokemonCardProps {
  id: number;
  name: string;
}

export default function PokemonCard({ id, name }: PokemonCardProps) {
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <Link href={`/pokemon/${id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: AC.secondarySystemBackground as any,
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 12,
          alignItems: 'center',
          opacity: pressed ? 0.7 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        })}
      >
        <Image
          source={{ uri: sprite }}
          style={{
            width: 100,
            height: 100,
          }}
          contentFit="contain"
        />
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: '600',
            color: AC.label as any,
            textTransform: 'capitalize',
            textAlign: 'center',
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontSize: 12,
            color: AC.secondaryLabel as any,
          }}
        >
          #{id.toString().padStart(3, '0')}
        </Text>
      </Pressable>
    </Link>
  );
}
