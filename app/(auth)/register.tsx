import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      Alert.alert('Atenção', 'Preenche todos os campos!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'Senha precisa ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);

    try {
      // 🌐 Chamada REAL pra API
      const { data } = await api.post('/auth/register', {
        name,
        username,
        email,
        password,
      });

      // O backend já devolve token — login automático após cadastro 🪄
      await setAuth(data.token, data.user);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Não foi possível criar a conta.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#141414',
    color: '#fff' as const,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    fontSize: 16,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>

        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ fontSize: 42, fontWeight: '900', color: '#8B5CF6', letterSpacing: -2 }}>
            PULSE
          </Text>
          <Text style={{ color: '#444', fontSize: 14, marginTop: 6 }}>
            cria tua conta
          </Text>
        </View>

        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#444"
          value={name}
          onChangeText={setName}
          style={inputStyle}
        />
        <TextInput
          placeholder="Username (ex: boni)"
          placeholderTextColor="#444"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={inputStyle}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inputStyle}
        />
        <TextInput
          placeholder="Senha (mín. 6 caracteres)"
          placeholderTextColor="#444"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ ...inputStyle, marginBottom: 28 }}
        />

        <TouchableOpacity
          onPress={handleRegister}
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
            : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Criar conta</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>
              Já tem conta?{'  '}
              <Text style={{ color: '#8B5CF6', fontWeight: '600' }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </Link>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
