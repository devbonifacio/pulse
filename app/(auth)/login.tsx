import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { palette, typography, radius, spacing } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preenche todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await setAuth(data.token, data.user);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Não foi possível entrar.';
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setLoading(false);
    }
  };

  const inputContainer = (field: string) => {
    const isFocused = focusedField === field;
    return {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: palette.black_raised,
      borderWidth: 1,
      borderColor: isFocused ? palette.green : palette.black_border,
      borderLeftWidth: isFocused ? 2 : 1,
      borderLeftColor: isFocused ? palette.green : palette.black_border,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      height: 52,
      marginBottom: spacing.md,
    };
  };

  const labelStyle = (field: string) => ({
    fontFamily: typography.fonts.mono,
    fontSize: typography.size.xs,
    letterSpacing: typography.tracking.widest,
    color: focusedField === field ? palette.green : palette.white_muted,
    textTransform: 'uppercase' as const,
    marginBottom: 6,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: palette.black_soft }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>

        {/* Header terminal */}
        <View style={{ marginBottom: spacing.xxxl }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.xs,
            color: palette.green,
            letterSpacing: typography.tracking.widest,
            marginBottom: 8,
          }}>
            ▌ PULSE.SYS [v1.0]
          </Text>
          <Text style={{
            fontFamily: typography.fonts.display,
            fontSize: typography.size.display,
            color: palette.white,
            letterSpacing: typography.tracking.tight,
          }}>
            entrar
          </Text>
          <Text style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.size.sm,
            color: palette.white_dim,
            marginTop: 6,
          }}>
            vive o momento, não o filtro
          </Text>
        </View>

        <Text style={labelStyle('email')}>// email</Text>
        <View style={inputContainer('email')}>
          <TextInput
            placeholder="user@pulse.app"
            placeholderTextColor={palette.white_ghost}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              flex: 1,
              fontFamily: typography.fonts.mono,
              fontSize: typography.size.md,
              color: palette.white,
            }}
          />
        </View>

        <Text style={labelStyle('password')}>// senha</Text>
        <View style={inputContainer('password')}>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={palette.white_ghost}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            secureTextEntry
            style={{
              flex: 1,
              fontFamily: typography.fonts.mono,
              fontSize: typography.size.md,
              color: palette.white,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
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
                ▶  ENTRAR
              </Text>
            )
          }
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={{ marginTop: spacing.xl, alignItems: 'center' }}>
            <Text style={{
              fontFamily: typography.fonts.mono,
              fontSize: typography.size.sm,
              color: palette.white_muted,
              letterSpacing: typography.tracking.wide,
            }}>
              não tem conta?{'  '}
              <Text style={{ color: palette.green }}>criar agora →</Text>
            </Text>
          </TouchableOpacity>
        </Link>

      </View>
    </KeyboardAvoidingView>
  );
}
