import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const { token, isLoading, loadStoredAuth } = useAuthStore();
  const segments = useSegments();

  // Quando o app abre, lê o token salvo no AsyncStorage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Sempre que o estado de auth mudar, decide pra onde mandar o usuário
  useEffect(() => {
    if (isLoading) return; // ainda carregando, espera

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Não tá logado e tá tentando acessar área protegida → manda pro login
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Já tá logado mas tá na tela de login → manda pro app
      router.replace('/');
    }
  }, [token, isLoading, segments]);

  // Enquanto carrega, mostra um spinner roxo
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0a' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="conversation/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
