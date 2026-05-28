import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../../components/Avatar';

const MOODS = ['😊', '🔥', '😌', '😢', '😤', '✨'];

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0a0a' }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Avatar + nome */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{ marginBottom: 14 }}>
            <Avatar name={user?.name || '?'} size={96} showRing />
          </View>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            {user?.name || 'Usuário'}
          </Text>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
            @{user?.username || 'username'}
          </Text>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row', backgroundColor: '#141414',
          borderRadius: 16, padding: 20, marginBottom: 16,
          borderWidth: 1, borderColor: '#1e1e1e',
        }}>
          {[
            { label: 'Pulsos', value: '0' },
            { label: 'Amigos', value: '0' },
            { label: 'Círculos', value: '3' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={{
              flex: 1, alignItems: 'center',
              borderRightWidth: i < arr.length - 1 ? 1 : 0,
              borderRightColor: '#1e1e1e',
            }}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{stat.value}</Text>
              <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Mood tracker */}
        <View style={{
          backgroundColor: '#141414', borderRadius: 16,
          padding: 16, marginBottom: 16,
          borderWidth: 1, borderColor: '#1e1e1e',
        }}>
          <Text style={{ color: '#888', fontSize: 13, marginBottom: 14, fontWeight: '600' }}>
            Como você tá hoje?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {MOODS.map(emoji => {
              const isSelected = selectedMood === emoji;
              return (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setSelectedMood(emoji)}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    backgroundColor: isSelected ? '#8B5CF620' : 'transparent',
                    borderWidth: 1,
                    borderColor: isSelected ? '#8B5CF6' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 28, opacity: isSelected ? 1 : 0.6 }}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Círculos */}
        <View style={{
          backgroundColor: '#141414', borderRadius: 16,
          padding: 16, marginBottom: 24,
          borderWidth: 1, borderColor: '#1e1e1e',
        }}>
          <Text style={{ color: '#888', fontSize: 13, marginBottom: 14, fontWeight: '600' }}>
            Seus círculos
          </Text>
          {[
            { name: 'Íntimos', color: '#EC4899', count: 0 },
            { name: 'Amigos', color: '#8B5CF6', count: 0 },
            { name: 'Conhecidos', color: '#10B981', count: 0 },
          ].map(circle => (
            <View key={circle.name} style={{
              flexDirection: 'row', alignItems: 'center',
              paddingVertical: 10, gap: 12,
            }}>
              <View style={{
                width: 10, height: 10, borderRadius: 5, backgroundColor: circle.color,
              }} />
              <Text style={{ color: '#fff', flex: 1, fontSize: 14 }}>{circle.name}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>{circle.count} pessoas</Text>
            </View>
          ))}
        </View>

        {/* Sair */}
        <TouchableOpacity
          onPress={logout}
          style={{
            borderWidth: 1, borderColor: '#EF444430',
            borderRadius: 12, padding: 16, alignItems: 'center',
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '600' }}>Sair da conta</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
