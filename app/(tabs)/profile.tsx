import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../../components/Avatar';
import { palette, typography, radius, spacing } from '../../constants/theme';

const MOODS = ['😊', '🔥', '😌', '😢', '😤', '✨'];

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const sectionTitle = (label: string) => (
    <Text style={{
      fontFamily: typography.fonts.mono,
      fontSize: typography.size.xs,
      color: palette.white_muted,
      letterSpacing: typography.tracking.widest,
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      // {label}
    </Text>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.black_soft }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingTop: 56, paddingHorizontal: spacing.lg, paddingBottom: 40 }}>

        {/* Identidade */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
          <View style={{ marginBottom: 14 }}>
            <Avatar name={user?.name || '?'} size={96} showRing online />
          </View>
          <Text style={{
            fontFamily: typography.fonts.display,
            fontSize: typography.size.xxl,
            color: palette.white,
            letterSpacing: typography.tracking.tight,
          }}>
            {user?.name || 'usuário'}
          </Text>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.sm,
            color: palette.green,
            letterSpacing: typography.tracking.wider,
            marginTop: 4,
          }}>
            @{user?.username || 'username'}
          </Text>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: palette.black_card,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: palette.black_border,
          paddingVertical: 18,
          marginBottom: spacing.lg,
        }}>
          {[
            { label: 'PULSOS',  value: '0' },
            { label: 'AMIGOS',  value: '0' },
            { label: 'CIRCLES', value: '3' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={{
              flex: 1,
              alignItems: 'center',
              borderRightWidth: i < arr.length - 1 ? 1 : 0,
              borderRightColor: palette.black_subtle,
            }}>
              <Text style={{
                fontFamily: typography.fonts.monoBold,
                fontSize: typography.size.xxl,
                color: palette.green,
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontFamily: typography.fonts.mono,
                fontSize: 10,
                color: palette.white_muted,
                letterSpacing: typography.tracking.widest,
                marginTop: 4,
              }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Mood */}
        <View style={{
          backgroundColor: palette.black_card,
          borderRadius: radius.sm,
          padding: spacing.base,
          marginBottom: spacing.base,
          borderWidth: 1,
          borderColor: palette.black_border,
        }}>
          {sectionTitle('como você tá hoje?')}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {MOODS.map(emoji => {
              const isSelected = selectedMood === emoji;
              return (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setSelectedMood(isSelected ? null : emoji)}
                  activeOpacity={0.75}
                  style={{
                    padding: 8,
                    borderRadius: radius.sm,
                    backgroundColor: isSelected ? palette.green + '20' : 'transparent',
                    borderWidth: 1,
                    borderColor: isSelected ? palette.green : palette.black_border,
                    borderLeftWidth: isSelected ? 2 : 1,
                    borderLeftColor: isSelected ? palette.green : palette.black_border,
                  }}
                >
                  <Text style={{ fontSize: 26, opacity: isSelected ? 1 : 0.55 }}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Círculos */}
        <View style={{
          backgroundColor: palette.black_card,
          borderRadius: radius.sm,
          padding: spacing.base,
          marginBottom: spacing.xl,
          borderWidth: 1,
          borderColor: palette.black_border,
        }}>
          {sectionTitle('seus círculos')}
          {[
            { name: 'INTIMATE',      color: palette.circles.intimate,      count: 0 },
            { name: 'FRIENDS',       color: palette.circles.friends,       count: 0 },
            { name: 'ACQUAINTANCES', color: palette.circles.acquaintances, count: 0 },
          ].map(circle => (
            <View key={circle.name} style={{
              flexDirection: 'row', alignItems: 'center',
              paddingVertical: 8, gap: 12,
            }}>
              <View style={{
                width: 8, height: 8, borderRadius: 2,
                backgroundColor: circle.color,
              }} />
              <Text style={{
                color: palette.white, flex: 1,
                fontFamily: typography.fonts.mono,
                fontSize: 12,
                letterSpacing: typography.tracking.wider,
              }}>
                {circle.name}
              </Text>
              <Text style={{
                fontFamily: typography.fonts.mono, fontSize: 11,
                color: palette.white_muted,
                letterSpacing: typography.tracking.wider,
              }}>
                [{String(circle.count).padStart(2, '0')}]
              </Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.75}
          style={{
            borderWidth: 1,
            borderColor: palette.red + '50',
            borderLeftWidth: 2,
            borderLeftColor: palette.red,
            borderRadius: radius.sm,
            paddingVertical: 14,
            alignItems: 'center',
            backgroundColor: palette.red_subtle,
          }}
        >
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.sm,
            color: palette.red,
            letterSpacing: typography.tracking.wide,
          }}>
            ✕  encerrar sessão
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
