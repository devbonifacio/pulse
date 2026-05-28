import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { socket } from '../../services/socket';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';
import { palette, typography, radius, spacing } from '../../constants/theme';

interface UserItem {
  _id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export default function Chat() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [onlineIds, setOnlineIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get<UserItem[]>('/users');
      setUsers(data);
    } catch (err: any) {
      console.error('Erro ao buscar users:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchUsers(); }, []));

  useEffect(() => {
    const handleOnline = (ids: string[]) => setOnlineIds(ids);
    socket.on('users:online', handleOnline);
    return () => { socket.off('users:online', handleOnline); };
  }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchUsers(); }, []);

  const openConversation = (user: UserItem) => {
    router.push({
      pathname: '/conversation/[id]',
      params: { id: user._id, name: user.name, username: user.username },
    });
  };

  const renderUser = ({ item }: { item: UserItem }) => {
    const isOnline = onlineIds.includes(item._id);

    return (
      <TouchableOpacity
        onPress={() => openConversation(item)}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row', alignItems: 'center',
          paddingVertical: 14, paddingHorizontal: spacing.base,
          borderBottomWidth: 1, borderBottomColor: palette.black_subtle,
          gap: 14,
          // Borda esquerda verde se online (assinatura PULSE)
          borderLeftWidth: isOnline ? 2 : 0,
          borderLeftColor: isOnline ? palette.green : 'transparent',
          paddingLeft: isOnline ? spacing.base - 2 : spacing.base,
        }}
      >
        <Avatar name={item.name} size={48} online={isOnline} />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 14,
            color: palette.white,
            letterSpacing: 0.3,
          }}>
            {item.name}
          </Text>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 11,
            color: isOnline ? palette.green : palette.white_muted,
            letterSpacing: typography.tracking.wider,
            marginTop: 2,
          }}>
            {isOnline ? '● ONLINE' : `@${item.username}`}
          </Text>
        </View>

        <Text style={{ color: palette.white_muted, fontSize: 18 }}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
      <Text style={{ fontFamily: typography.fonts.mono, fontSize: 40, color: palette.green, marginBottom: 16 }}>▣</Text>
      <Text style={{
        fontFamily: typography.fonts.display, fontSize: typography.size.xl,
        color: palette.white, marginBottom: 6,
      }}>
        nenhum amigo
      </Text>
      <Text style={{
        fontFamily: typography.fonts.mono, fontSize: 11,
        color: palette.white_muted, letterSpacing: typography.tracking.wider,
        textAlign: 'center', paddingHorizontal: 40,
      }}>
        [ crie outra conta em outra aba ]{'\n'}[ pra testar o chat ]
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.black_soft }}>
      <View style={{
        paddingTop: 56, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
        borderBottomWidth: 1, borderBottomColor: palette.black_border,
        backgroundColor: palette.black,
      }}>
        <Text style={{
          fontFamily: typography.fonts.mono,
          fontSize: 9,
          color: palette.green,
          letterSpacing: typography.tracking.widest,
          marginBottom: 2,
        }}>
          ▌ INBOX
        </Text>
        <Text style={{
          fontFamily: typography.fonts.display, fontSize: typography.size.xxl,
          color: palette.white, letterSpacing: typography.tracking.tight,
        }}>
          mensagens
        </Text>
        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: 11,
          color: palette.white_muted, letterSpacing: typography.tracking.wider,
          marginTop: 4,
        }}>
          [{String(onlineIds.length).padStart(2, '0')}] online · realtime
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.green} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.green} />}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
