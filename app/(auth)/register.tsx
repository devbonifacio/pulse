import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { palette, typography, radius, spacing } from '../../constants/theme';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
      const { data } = await api.post('/auth/register', { name, username, email, password });
      await setAuth(data.token, data.user);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field: string, label: string, value: string, setValue: (v: string) => void, opts: any = {}) => {
    const isFocused = focusedField === field;
    return (
      <View style={{ marginBottom: spacing.md }}>
        <Text style={{
          fontFamily: typography.fonts.mono,
          fontSize: typography.size.xs,
          letterSpacing: typography.tracking.widest,
          color: isFocused ? palette.green : palette.white_muted,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          // {label}
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.black_raised,
          borderWidth: 1,
          borderColor: isFocused ? palette.green : palette.black_border,
          borderLeftWidth: isFocused ? 2 : 1,
          borderLeftColor: isFocused ? palette.green : palette.black_border,
          borderRadius: radius.sm,
          paddingHorizontal: 14,
          height: 52,
        }}>
          {opts.prefix && (
            <Text style={{ fontFamily: typography.fonts.mono, color: palette.white_muted, marginRight: 2 }}>
              {opts.prefix}
            </Text>
          )}
          <TextInput
            placeholder={opts.placeholder}
            placeholderTextColor={palette.white_ghost}
            value={value}
            onChangeText={setValue}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            keyboardType={opts.keyboard}
            autoCapitalize={opts.autoCapitalize ?? 'sentences'}
            secureTextEntry={opts.secure}
            style={{
              flex: 1,
              fontFamily: typography.fonts.mono,
              fontSize: typography.size.md,
              color: palette.white,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: palette.black_soft }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.xl }}>

        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.xs,
            color: palette.green,
            letterSpacing: typography.tracking.widest,
            marginBottom: 8,
          }}>
            ▌ NEW USER · INIT
          </Text>
          <Text style={{
            fontFamily: typography.fonts.display,
            fontSize: typography.size.xxl,
            color: palette.white,
            letterSpacing: typography.tracking.tight,
          }}>
            criar conta
          </Text>
        </View>

        {renderInput('name', 'nome', name, setName, { placeholder: 'Bonifácio Junior' })}
        {renderInput('username', 'username', username, setUsername, {
          placeholder: 'boni', prefix: '@', autoCapitalize: 'none',
        })}
        {renderInput('email', 'email', email, setEmail, {
          placeholder: 'user@pulse.app', keyboard: 'email-address', autoCapitalize: 'none',
        })}
        {renderInput('password', 'senha (mín. 6)', password, setPassword, {
          placeholder: '••••••••', secure: true,
        })}

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
          style={{
            backgroundColor: palette.green,
            height: 52,
            borderRadius: radius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.6 : 1,
            marginTop: spacing.md,
          }}
        >
          {loading
            ? <ActivityIndicator color={palette.black} />
            : (
              <Text style={{
                fontFamily: typography.fonts.bodyMed,
                fontSize: typography.size.md,
                color: palette.black,
                letterSpacing: typography.tracking.wide,
              }}>
                ▶  CRIAR CONTA
              </Text>
            )
          }
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={{ marginTop: spacing.xl, alignItems: 'center' }}>
            <Text style={{
              fontFamily: typography.fonts.mono,
              fontSize: typography.size.sm,
              color: palette.white_muted,
              letterSpacing: typography.tracking.wide,
            }}>
              já tem conta?{'  '}
              <Text style={{ color: palette.green }}>← entrar</Text>
            </Text>
          </TouchableOpacity>
        </Link>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
