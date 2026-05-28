import { View, Text } from 'react-native';
import { palette, typography } from '../constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizesMap: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 96 };
const fontMap: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 14, lg: 20, xl: 32 };

function sizeKeyFromNumber(n: number): AvatarSize {
  if (n <= 26) return 'xs';
  if (n <= 34) return 'sm';
  if (n <= 44) return 'md';
  if (n <= 70) return 'lg';
  return 'xl';
}

interface AvatarProps {
  name: string;
  size?: AvatarSize | number;
  online?: boolean;
  showRing?: boolean;
  circleType?: 'intimate' | 'friends' | 'acquaintances';
}

export function Avatar({ name, size = 'md', online, showRing, circleType }: AvatarProps) {
  const dim = typeof size === 'number' ? size : sizesMap[size];
  const fontSize = typeof size === 'number' ? fontMap[sizeKeyFromNumber(size)] : fontMap[size];
  const initials = (name || '?').split(' ').map(n => n[0] ?? '').slice(0, 2).join('').toUpperCase() || '?';
  const accent = circleType ? palette.circles[circleType] : palette.green;
  const dot = Math.max(8, dim * 0.22);

  return (
    <View style={{ width: dim, height: dim }}>
      <View style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor: accent + '18',
        borderWidth: showRing ? 2 : 1,
        borderColor: accent + (showRing ? 'cc' : '50'),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontFamily: typography.fonts.monoBold,
          fontSize,
          color: accent,
          letterSpacing: -0.5,
        }}>
          {initials}
        </Text>
      </View>
      {online !== undefined && (
        <View style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: dot, height: dot, borderRadius: dot / 2,
          backgroundColor: online ? palette.online : palette.offline,
          borderWidth: 1.5,
          borderColor: palette.black_card,
        }} />
      )}
    </View>
  );
}
