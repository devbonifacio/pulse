import { View, Text } from 'react-native';

// Paleta de cores pros avatares
const COLORS = [
  '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
  '#3B82F6', '#EF4444', '#14B8A6', '#A855F7',
];

// Hash simples pra mapear nome → cor (mesmo nome = mesma cor sempre)
function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

// Pega as iniciais (até 2 letras)
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
  showRing?: boolean;
}

export function Avatar({ name, size = 48, online, showRing }: AvatarProps) {
  const color = colorFromName(name);
  const initials = getInitials(name);
  const dotSize = Math.max(10, size * 0.26);

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${color}25`, // 25 = ~15% opacity
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: showRing ? 2 : 1,
          borderColor: showRing ? color : `${color}50`,
        }}
      >
        <Text style={{ color, fontWeight: '700', fontSize: size * 0.36 }}>
          {initials || '?'}
        </Text>
      </View>

      {online && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#10B981',
            borderWidth: 2,
            borderColor: '#0a0a0a',
          }}
        />
      )}
    </View>
  );
}
