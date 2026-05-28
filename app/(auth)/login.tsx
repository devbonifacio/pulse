import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preenche todos os campos!');
      return;
    }
    setLoading(true);

    try {
      // 🌐 Chamada REAL pra API
      const { data } = await api.post('/auth/login', { email, password });

      // Salva token + user no Zustand (que persiste no AsyncStorage)
      await setAuth(data.token, data.user);
      // Redirect acontece automático no _layout.tsx ✨
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Não foi possível entrar. Verifique sua conexão.';
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>

        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ fontSize: 52, fontWeight: '900', color: '#8B5CF6', letterSpacing: -2 }}>
            PULSE
          </Text>
          <Text style={{ color: '#444', fontSize: 14, marginTop: 6, letterSpacing: 1 }}>
            vive o momento, não o filtro
          </Text>
        </View>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#141414',
            color: '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#1e1e1e',
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#444"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: '#141414',
            color: '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: '#1e1e1e',
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: '#8B5CF6',
            padding: 18,
            borderRadius: 999,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Entrar</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>
              Não tem conta?{'  '}
              <Text style={{ color: '#8B5CF6', fontWeight: '600' }}>Criar agora</Text>
            </Text>
          </TouchableOpacity>
        </Link>

      </View>
    </KeyboardAvoidingView>
  );
}
