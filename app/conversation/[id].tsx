import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { socket } from '../../services/socket';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';

// Formata "14:32"
function formatTime(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

interface Message {
  _id?: string;
  from: string;
  to: string;
  content: string;
  createdAt?: string;
  pending?: boolean;
}

export default function Conversation() {
  const { id, name, username } = useLocalSearchParams<{ id: string; name: string; username: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Escuta lista de online pra saber se essa pessoa tá ativa
  useEffect(() => {
    const handleOnline = (ids: string[]) => setOtherOnline(ids.includes(id));
    socket.on('users:online', handleOnline);
    return () => { socket.off('users:online', handleOnline); };
  }, [id]);

  // Carrega histórico
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Message[]>(`/chat/${id}`);
        setMessages(data);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Escuta novas mensagens em tempo real
  useEffect(() => {
    const handleReceive = (msg: Message) => {
      if (msg.from === id) {
        setMessages(prev => [...prev, msg]);
        setOtherTyping(false);
      }
    };

    const handleSent = (msg: Message) => {
      // Substitui a mensagem "pending" pela confirmada
      setMessages(prev => {
        const filtered = prev.filter(m => !(m.pending && m.content === msg.content));
        return [...filtered, msg];
      });
    };

    const handleTyping = (data: { from: string }) => {
      if (data.from === id) setOtherTyping(true);
    };

    const handleStopTyping = (data: { from: string }) => {
      if (data.from === id) setOtherTyping(false);
    };

    socket.on('message:receive', handleReceive);
    socket.on('message:sent', handleSent);
    socket.on('typing:from', handleTyping);
    socket.on('typing:stop:from', handleStopTyping);

    return () => {
      socket.off('message:receive', handleReceive);
      socket.off('message:sent', handleSent);
      socket.off('typing:from', handleTyping);
      socket.off('typing:stop:from', handleStopTyping);
    };
  }, [id]);

  // Scroll automático ao chegar mensagem nova
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // Enviar typing indicator
  const handleTextChange = (value: string) => {
    setText(value);
    socket.emit('typing:start', { to: id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { to: id });
    }, 1500);
  };

  const sendMessage = () => {
    const content = text.trim();
    if (!content) return;

    // Otimista: adiciona localmente já como "pending"
    const pendingMsg: Message = {
      from: user!.id,
      to: id,
      content,
      pending: true,
    };
    setMessages(prev => [...prev, pendingMsg]);

    socket.emit('message:send', { to: id, content });
    setText('');
    socket.emit('typing:stop', { to: id });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.from === user?.id;
    return (
      <View style={{
        alignItems: isMine ? 'flex-end' : 'flex-start',
        marginVertical: 3, paddingHorizontal: 12,
      }}>
        <View style={{
          backgroundColor: isMine ? '#8B5CF6' : '#1e1e1e',
          paddingHorizontal: 14, paddingVertical: 10,
          borderRadius: 18,
          borderBottomRightRadius: isMine ? 4 : 18,
          borderBottomLeftRadius: isMine ? 18 : 4,
          maxWidth: '78%',
          opacity: item.pending ? 0.6 : 1,
        }}>
          <Text style={{ color: '#fff', fontSize: 15 }}>{item.content}</Text>
        </View>
        {item.createdAt && (
          <Text style={{
            color: '#444', fontSize: 10, marginTop: 3,
            marginHorizontal: 6,
          }}>
            {formatTime(item.createdAt)}{item.pending ? ' · enviando…' : ''}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header customizado */}
      <View style={{
        paddingTop: 50, paddingHorizontal: 16, paddingBottom: 14,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderBottomWidth: 1, borderBottomColor: '#1e1e1e',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Text style={{ color: '#8B5CF6', fontSize: 24, fontWeight: '600' }}>‹</Text>
        </TouchableOpacity>

        <Avatar name={name || '?'} size={40} online={otherOnline} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{name}</Text>
          <Text style={{
            color: otherTyping ? '#10B981' : otherOnline ? '#10B981' : '#555',
            fontSize: 12, marginTop: 2,
          }}>
            {otherTyping ? 'digitando...' : otherOnline ? '● online' : `@${username}`}
          </Text>
        </View>
      </View>

      {/* Mensagens */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, i) => item._id || `pending-${i}`}
            contentContainerStyle={{ paddingVertical: 14, flexGrow: 1 }}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>💬</Text>
                <Text style={{ color: '#555', fontSize: 13 }}>Manda a primeira mensagem</Text>
              </View>
            }
          />

          {/* Input */}
          <View style={{
            flexDirection: 'row', padding: 12, gap: 10, alignItems: 'flex-end',
            borderTopWidth: 1, borderTopColor: '#1e1e1e',
            backgroundColor: '#0a0a0a',
          }}>
            <TextInput
              value={text}
              onChangeText={handleTextChange}
              placeholder="Mensagem..."
              placeholderTextColor="#444"
              multiline
              style={{
                flex: 1,
                backgroundColor: '#141414',
                color: '#fff',
                paddingHorizontal: 14, paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1, borderColor: '#1e1e1e',
                fontSize: 15,
                maxHeight: 100,
              }}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!text.trim()}
              style={{
                backgroundColor: text.trim() ? '#8B5CF6' : '#1e1e1e',
                width: 44, height: 44, borderRadius: 22,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
