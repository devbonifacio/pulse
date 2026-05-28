import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URL base do backend
// Web: localhost funciona
// Android emulador: precisa de 10.0.2.2
// Celular físico: precisa do IP da sua máquina na rede local
const getBaseURL = () => {
  if (Platform.OS === 'web') return 'http://localhost:3001/api';
  if (Platform.OS === 'android') return 'http://10.0.2.2:3001/api';
  return 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Interceptor: anexa o token JWT em TODA requisição automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@pulse:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
