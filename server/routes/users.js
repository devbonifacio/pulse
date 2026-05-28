const router = require('express').Router();
const User = require('../models/User');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// 👥 GET /api/users — lista todos os usuários (menos o próprio)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('name username avatar')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error('Erro ao listar users:', err);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// 💬 GET /api/users/conversations — usuários com quem já conversei
router.get('/conversations', auth, async (req, res) => {
  try {
    // Pega todas as mensagens minhas
    const messages = await Message.find({
      $or: [{ from: req.userId }, { to: req.userId }],
    }).sort({ createdAt: -1 });

    // Extrai IDs únicos das pessoas com quem falei
    const otherUserIds = new Set();
    messages.forEach(m => {
      const other = m.from.toString() === req.userId ? m.to : m.from;
      otherUserIds.add(other.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(otherUserIds) } })
      .select('name username avatar');

    res.json(users);
  } catch (err) {
    console.error('Erro ao listar conversas:', err);
    res.status(500).json({ message: 'Erro ao listar conversas' });
  }
});

module.exports = router;
