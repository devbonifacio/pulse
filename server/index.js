require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const pulsesRoutes = require('./routes/pulses');
const chatRoutes = require('./routes/chat');
const usersRoutes = require('./routes/users');
const { initSocket } = require('./socket/events');

const app = express();
const server = http.createServer(app); // HTTP server pra anexar Socket.io
const PORT = process.env.PORT || 3001;

// Socket.io
const io = new Server(server, {
  cors: { origin: '*' },
});
initSocket(io);

// Middlewares globais
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pulses', pulsesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: '🚀 PULSE API rodando!', timestamp: new Date() });
});

// Conecta no MongoDB e sobe o servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ativo`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
