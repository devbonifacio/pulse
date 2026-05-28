const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// 💬 GET /api/chat/:userId — pegar histórico de mensagens com um amigo
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.userId, to: req.params.userId },
        { from: req.params.userId, to: req.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
});

// ✉️ POST /api/chat — enviar mensagem
router.post('/', auth, async (req, res) => {
  try {
    const { to, content, type } = req.body;

    if (!to || !content) {
      return res.status(400).json({ message: 'Destinatário e conteúdo são obrigatórios' });
    }

    const message = await Message.create({
      from: req.userId,
      to,
      content,
      type: type || 'text',
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
});

// 👁️ PATCH /api/chat/:id/seen — marcar como lida (mensagem some)
router.patch('/:id/seen', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }

    // Só o destinatário pode marcar como lida
    if (message.to.toString() !== req.userId) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    message.seenAt = new Date();
    await message.save();

    // Se a mensagem é "desaparece após ler", deleta agora
    if (message.disappears) {
      await message.deleteOne();
      return res.json({ message: 'Mensagem visualizada e apagada', deleted: true });
    }

    res.json(message);
  } catch (err) {
    console.error('Erro ao marcar como lida:', err);
    res.status(500).json({ message: 'Erro ao marcar como lida' });
  }
});

module.exports = router;
