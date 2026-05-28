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
import { palette, typography, radius, spacing } from '../../constants/theme';

interface Message {
  _id?: string;
  from: string;
  to: string;
  content: string;
  createdAt?: string;
  pending?: boolean;
}

function formatTime(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
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

  useEffect(() => {
    const handleOnline = (ids: string[]) => setOtherOnline(ids.includes(id));
    socket.on('users:online', handleOnline);
    return () => { socket.off('users:online', handleOnline); };
  }, [id]);

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

  useEffect(() => {
    const handleReceive = (msg: Message) => {
      if (msg.from === id) { setMessages(prev => [...prev, msg]); setOtherTyping(false); }
    };
    const handleSent = (msg: Message) => {
      setMessages(prev => {
        const filtered = prev.filter(m => !(m.pending && m.content === msg.content));
        return [...filtered, msg];
      });
    };
    const handleTyping = (data: { from: string }) => { if (data.from === id) setOtherTyping(true); };
    const handleStopTyping = (data: { from: string }) => { if (data.from === id) setOtherTyping(false); };

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

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

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

    const pendingMsg: Message = { from: user!.id, to: id, content, pending: true };
    setMessages(prev => [...prev, pendingMsg]);
    socket.emit('message:send', { to: id, content });
    setText('');
    socket.emit('typing:stop', { to: id });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.from === user?.id;
    return (
      <View style={{
        alignSelf: isMine ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        marginBottom: 8,
        marginHorizontal: spacing.base,
      }}>
        <View style={{
          backgroundColor: isMine ? palette.green : palette.black_raised,
          borderRadius: radius.sm,
          borderBottomRightRadius: isMine ? 0 : radius.sm,
          borderBottomLeftRadius: isMine ? radius.sm : 0,
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderWidth: 1,
          borderColor: isMine ? palette.green : palette.black_subtle,
          opacity: item.pending ? 0.65 : 1,
        }}>
          <Text style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.size.base,
            color: isMine ? palette.black : palette.white,
            lineHeight: 20,
          }}>
            {item.content}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3,
          justifyContent: isMine ? 'flex-end' : 'flex-start', paddingHorizontal: 2,
        }}>
          {item.createdAt && (
            <Text style={{
              fontFamily: typography.fonts.mono, fontSize: 9,
              color: palette.white_ghost, letterSpacing: typography.tracking.wider,
            }}>
              {formatTime(item.createdAt)}{item.pending ? '  ◌' : isMine ? '  ✓' : ''}
            </Text>
          )}
          {item.pending && !item.createdAt && (
            <Text style={{
              fontFamily: typography.fonts.mono, fontSize: 9,
              color: palette.white_ghost, letterSpacing: typography.tracking.wider,
            }}>
              ◌ enviando…
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.black_soft }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={{
        paddingTop: 50, paddingHorizontal: 14, paddingBottom: 12,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderBottomWidth: 1, borderBottomColor: palette.black_border,
        backgroundColor: palette.black,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }} activeOpacity={0.7}>
          <Text style={{ color: palette.green, fontSize: 24 }}>‹</Text>
        </TouchableOpacity>

        <Avatar name={name || '?'} size={40} online={otherOnline} />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 14,
            color: palette.white,
            letterSpacing: 0.3,
          }}>
            {name}
          </Text>
          <Text style={{
            fontFamily: typography.fonts.mono, fontSize: 10,
            color: otherTyping || otherOnline ? palette.green : palette.white_muted,
            letterSpacing: typography.tracking.wider,
            marginTop: 2,
          }}>
            {otherTyping ? '● DIGITANDO…' : otherOnline ? '● ONLINE' : `@${username}`}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.green} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, i) => item._id || `pending-${i}`}
            contentContainerStyle={{ paddingVertical: 14, flexGrow: 1 }}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
                <Text style={{ fontFamily: typography.fonts.mono, fontSize: 32, color: palette.green, marginBottom: 14 }}>▣</Text>
                <Text style={{
                  fontFamily: typography.fonts.mono, fontSize: 11,
                  color: palette.white_muted, letterSpacing: typography.tracking.wider,
                }}>
                  [ envie a primeira mensagem ]
                </Text>
              </View>
            }
          />

          {/* Input */}
          <View style={{
            flexDirection: 'row',
            padding: 12,
            gap: 10,
            alignItems: 'flex-end',
            borderTopWidth: 1,
            borderTopColor: palette.black_border,
            backgroundColor: palette.black,
          }}>
            <TextInput
              value={text}
              onChangeText={handleTextChange}
              placeholder="Mensagem..."
              placeholderTextColor={palette.white_ghost}
              multiline
              style={{
                flex: 1,
                backgroundColor: palette.black_raised,
                color: palette.white,
                fontFamily: typography.fonts.body,
                fontSize: typography.size.md,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: radius.sm,
                borderWidth: 1,
                borderColor: palette.black_border,
                maxHeight: 100,
              }}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!text.trim()}
              activeOpacity={0.8}
              style={{
                backgroundColor: text.trim() ? palette.green : palette.black_raised,
                width: 44, height: 44, borderRadius: radius.sm,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1,
                borderColor: text.trim() ? palette.green : palette.black_border,
              }}
            >
              <Text style={{
                color: text.trim() ? palette.black : palette.white_muted,
                fontSize: 18,
                fontFamily: typography.fonts.monoBold,
              }}>
                ▶
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
