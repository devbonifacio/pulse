const Message = require('../models/Message');

// Mapa de usuários online: userId -> socketId
const onlineUsers = new Map();

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Socket conectado:', socket.id);

    // 1️⃣ Usuário se identifica ao entrar no app
    socket.on('user:join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId; // guarda no próprio socket
      console.log('👤 Online:', userId);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    // 2️⃣ Enviar mensagem
    socket.on('message:send', async ({ to, content }) => {
      const from = socket.userId;
      if (!from || !to || !content) return;

      try {
        // Salva no MongoDB
        const message = await Message.create({ from, to, content, type: 'text' });

        // Manda pro destinatário (se estiver online)
        const targetSocketId = onlineUsers.get(to);
        if (targetSocketId) {
          io.to(targetSocketId).emit('message:receive', message);
        }

        // Confirma pro remetente
        socket.emit('message:sent', message);
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        socket.emit('message:error', { message: 'Erro ao enviar' });
      }
    });

    // 3️⃣ Usuário tá digitando (typing indicator)
    socket.on('typing:start', ({ to }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing:from', { from: socket.userId });
      }
    });

    socket.on('typing:stop', ({ to }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing:stop:from', { from: socket.userId });
      }
    });

    // 4️⃣ Desconectar
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log('👋 Offline:', socket.userId);
        io.emit('users:online', Array.from(onlineUsers.keys()));
      }
    });
  });
}

module.exports = { initSocket };
