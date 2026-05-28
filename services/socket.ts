import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

// URL do servidor Socket.io (mesma lógica do api.ts)
const getSocketURL = () => {
  if (Platform.OS === 'web') return 'http://localhost:3001';
  if (Platform.OS === 'android') return 'http://10.0.2.2:3001';
  return 'http://localhost:3001';
};

// Instância única do socket (singleton pattern)
export const socket: Socket = io(getSocketURL(), {
  autoConnect: false,        // só conecta quando mandar
  transports: ['websocket'], // força WebSocket (mais rápido que polling)
  reconnection: true,        // reconecta sozinho se cair
  reconnectionDelay: 1000,
});

// Conecta e identifica o usuário
export function connectSocket(userId: string) {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('user:join', userId);
}

// Desconecta (logout)
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
