import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { socket } from '../../services/socket';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';

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

  // Recarrega ao focar
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  // Escuta quem tá online em tempo real
  useEffect(() => {
    const handleOnline = (ids: string[]) => setOnlineIds(ids);
    socket.on('users:online', handleOnline);
    return () => { socket.off('users:online', handleOnline); };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, []);

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
        style={{
          flexDirection: 'row', alignItems: 'center', padding: 16,
          borderBottomWidth: 1, borderBottomColor: '#1e1e1e', gap: 14,
        }}
      >
        <Avatar name={item.name} size={52} online={isOnline} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>{item.name}</Text>
          <Text style={{ color: isOnline ? '#10B981' : '#555', fontSize: 13, marginTop: 3 }}>
            {isOnline ? '● online agora' : `@${item.username}`}
          </Text>
        </View>

        <Text style={{ color: '#444', fontSize: 18 }}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>💬</Text>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 6 }}>
        Nenhum amigo ainda
      </Text>
      <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', paddingHorizontal: 40 }}>
        Crie outra conta em outra aba pra testar o chat em tempo real ⚡
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{
        paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: '#1e1e1e',
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>Mensagens</Text>
        <Text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
          {onlineIds.length} {onlineIds.length === 1 ? 'pessoa online' : 'pessoas online'} · em tempo real
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
