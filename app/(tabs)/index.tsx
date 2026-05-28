import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Image, Dimensions,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';
import { palette, typography, radius, spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(width * 1.05, 480);

interface Pulse {
  _id: string;
  user: { _id: string; name: string; username: string; avatar: string | null };
  imageUrl: string;
  caption: string;
  mood: string;
  createdAt: string;
  reactions: { user: string; emoji: string }[];
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function Feed() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get<Pulse[]>('/pulses/feed');
      setPulses(data);
    } catch (err: any) {
      console.error('Erro no feed:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchFeed(); }, []));

  const onRefresh = useCallback(() => { setRefreshing(true); fetchFeed(); }, []);

  const handleReact = async (pulseId: string, emoji: string) => {
    try {
      const { data } = await api.post(`/pulses/${pulseId}/react`, { emoji });
      setPulses((prev) => prev.map(p => p._id === pulseId ? { ...p, reactions: data.reactions } : p));
    } catch {
      Alert.alert('Erro', 'Não foi possível reagir agora');
    }
  };

  const renderPulse = ({ item, index }: { item: Pulse; index: number }) => (
    <View style={{
      backgroundColor: palette.black_card,
      marginBottom: 1,
      overflow: 'hidden',
    }}>
      {/* HEADER */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: palette.black_subtle,
      }}>
        <Avatar name={item.user.name} size={36} circleType="friends" />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 13,
            color: palette.white,
            letterSpacing: 0.3,
          }}>
            {item.user.name}
          </Text>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 10,
            color: palette.white_muted,
            letterSpacing: typography.tracking.wider,
            marginTop: 1,
          }}>
            @{item.user.username}  ·  {timeAgo(item.createdAt)}
          </Text>
        </View>

        {item.mood ? (
          <View style={{
            backgroundColor: palette.green + '20',
            borderWidth: 1,
            borderColor: palette.green + '40',
            borderRadius: radius.sm,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}>
            <Text style={{ fontSize: 14 }}>{item.mood}</Text>
          </View>
        ) : null}
      </View>

      {/* IMAGEM */}
      {item.imageUrl ? (
        <View style={{ width: '100%', height: IMAGE_HEIGHT, backgroundColor: palette.black_raised }}>
          <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
      ) : (
        <View style={{ height: IMAGE_HEIGHT, backgroundColor: palette.black_raised, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: typography.fonts.mono, fontSize: 10, color: palette.white_ghost, letterSpacing: 2 }}>
            [NO_IMAGE]
          </Text>
        </View>
      )}

      {/* FOOTER */}
      <View style={{ padding: spacing.base }}>
        {item.caption ? (
          <Text style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.size.base,
            color: palette.white_dim,
            lineHeight: 20,
            marginBottom: 14,
          }}>
            {item.caption}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['❤️', '😂', '🔥', '😮'].map(emoji => {
            const count = item.reactions?.filter(r => r.emoji === emoji).length || 0;
            return (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReact(item._id, emoji)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: palette.black_raised,
                  borderWidth: 1,
                  borderColor: count > 0 ? palette.green + '40' : palette.black_subtle,
                  borderRadius: radius.sm,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  minHeight: 32,
                }}
              >
                <Text style={{ fontSize: 14 }}>{emoji}</Text>
                {count > 0 && (
                  <Text style={{
                    fontFamily: typography.fonts.monoBold,
                    fontSize: 11,
                    color: palette.green,
                  }}>
                    {count}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Numeração técnica (assinatura) */}
      <Text style={{
        position: 'absolute',
        top: 12, right: 12,
        fontFamily: typography.fonts.mono,
        fontSize: 9,
        color: palette.white_ghost,
        letterSpacing: typography.tracking.wider,
      }}>
        #{String(index + 1).padStart(3, '0')}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
      <Text style={{ fontFamily: typography.fonts.mono, fontSize: 40, color: palette.green, marginBottom: 16 }}>◉</Text>
      <Text style={{
        fontFamily: typography.fonts.display, fontSize: typography.size.xl,
        color: palette.white, marginBottom: 6,
      }}>
        feed vazio
      </Text>
      <Text style={{
        fontFamily: typography.fonts.mono, fontSize: 12,
        color: palette.white_muted, letterSpacing: typography.tracking.wider, textAlign: 'center',
      }}>
        [ tab PULSO → poste o primeiro ]
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.black_soft }}>
      {/* Header */}
      <View style={{
        paddingTop: 56,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: palette.black_border,
        backgroundColor: palette.black,
      }}>
        <View>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 9,
            color: palette.green,
            letterSpacing: typography.tracking.widest,
            marginBottom: 2,
          }}>
            ▌ FEED.LIVE
          </Text>
          <Text style={{
            fontFamily: typography.fonts.display,
            fontSize: typography.size.xxl,
            color: palette.white,
            letterSpacing: typography.tracking.tight,
          }}>
            pulse
          </Text>
        </View>

        <View style={{
          borderWidth: 1,
          borderColor: palette.green + '50',
          borderLeftWidth: 2,
          borderLeftColor: palette.green,
          backgroundColor: palette.green + '10',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: radius.sm,
        }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 10,
            color: palette.green,
            letterSpacing: typography.tracking.wider,
          }}>
            ● ONLINE
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.green} />
        </View>
      ) : (
        <FlatList
          data={pulses}
          renderItem={renderPulse}
          keyExtractor={item => item._id}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.green} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
