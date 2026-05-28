import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Image,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';

// Tipo de um pulso vindo do backend
interface Pulse {
  _id: string;
  user: { _id: string; name: string; username: string; avatar: string | null };
  imageUrl: string;
  caption: string;
  mood: string;
  createdAt: string;
  reactions: { user: string; emoji: string }[];
}

// Formata "2 min atrás", "1h atrás", etc
function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function Feed() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Busca o feed da API
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

  // Recarrega TODA VEZ que a tela ganha foco (volta pra aba Feed)
  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed();
  }, []);

  // Reagir com emoji
  const handleReact = async (pulseId: string, emoji: string) => {
    try {
      const { data } = await api.post(`/pulses/${pulseId}/react`, { emoji });
      // Atualiza só esse pulso na lista
      setPulses((prev) => prev.map(p => p._id === pulseId ? { ...p, reactions: data.reactions } : p));
    } catch {
      Alert.alert('Erro', 'Não foi possível reagir agora');
    }
  };

  const renderPulse = ({ item }: { item: Pulse }) => (
    <View style={{
      backgroundColor: '#141414',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#1e1e1e',
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
        <Avatar name={item.user.name} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{item.user.name}</Text>
          <Text style={{ color: '#555', fontSize: 12 }}>
            @{item.user.username} · {timeAgo(item.createdAt)}
          </Text>
        </View>
        {item.mood ? <Text style={{ fontSize: 22 }}>{item.mood}</Text> : null}
      </View>

      {/* Foto real do pulso */}
      {item.imageUrl ? (
        <View style={{ width: '100%', height: 400, backgroundColor: '#1a1a1a' }}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(e) => console.log('❌ Image error:', e.nativeEvent, 'URI length:', item.imageUrl?.length, 'preview:', item.imageUrl?.substring(0, 80))}
            onLoad={() => console.log('✅ Image loaded! URI length:', item.imageUrl?.length)}
          />
        </View>
      ) : (
        <View style={{ height: 320, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48 }}>📸</Text>
        </View>
      )}

      {/* Caption + reações */}
      <View style={{ padding: 14 }}>
        {item.caption ? (
          <Text style={{ color: '#ccc', fontSize: 14, marginBottom: 12 }}>{item.caption}</Text>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          {['❤️', '😂', '🔥', '😮'].map(emoji => {
            const count = item.reactions?.filter(r => r.emoji === emoji).length || 0;
            return (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReact(item._id, emoji)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
                {count > 0 && (
                  <Text style={{ color: '#888', fontSize: 12, fontWeight: '600' }}>{count}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  // Tela vazia (nenhum pulso ainda)
  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>⚡</Text>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 6 }}>
        Nenhum pulso ainda
      </Text>
      <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', paddingHorizontal: 40 }}>
        Vai na aba 📸 e seja o primeiro a postar
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <View style={{
        paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderBottomWidth: 1, borderBottomColor: '#1e1e1e',
      }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#8B5CF6', letterSpacing: -1 }}>PULSE</Text>
        <View style={{
          backgroundColor: '#8B5CF620',
          paddingHorizontal: 10, paddingVertical: 4,
          borderRadius: 999, borderWidth: 1, borderColor: '#8B5CF640',
        }}>
          <Text style={{ color: '#8B5CF6', fontSize: 11, fontWeight: '600' }}>● ao vivo</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={pulses}
          renderItem={renderPulse}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
