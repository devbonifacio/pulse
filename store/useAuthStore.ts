import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, disconnectSocket } from '../services/socket';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;

  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const TOKEN_KEY = '@pulse:token';
const USER_KEY = '@pulse:user';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setAuth: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, isLoading: false });
    connectSocket(user.id); // 🔌 conecta ao tempo real
  },

  logout: async () => {
    disconnectSocket(); // 🔌 desconecta antes de limpar
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ token: null, user: null, isLoading: false });
  },

  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;
      set({ token, user, isLoading: false });
      if (user?.id) connectSocket(user.id); // 🔌 reconecta ao abrir app
    } catch {
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
