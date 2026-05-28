const router = require('express').Router();
const Pulse = require('../models/Pulse');
const auth = require('../middleware/auth');

// ⚡ GET /api/pulses/feed — listar pulsos recentes
router.get('/feed', auth, async (req, res) => {
  try {
    const pulses = await Pulse.find()
      .populate('user', 'name username avatar') // inclui dados do dono
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(pulses);
  } catch (err) {
    console.error('Erro no feed:', err);
    res.status(500).json({ message: 'Erro ao buscar feed' });
  }
});

// 📸 POST /api/pulses — criar pulso
router.post('/', auth, async (req, res) => {
  try {
    const { imageUrl, caption, mood, circle } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Imagem é obrigatória' });
    }

    const pulse = await Pulse.create({
      user: req.userId,
      imageUrl,
      caption,
      mood,
      circle,
    });

    // Popula o user antes de devolver (pra UI já mostrar quem postou)
    await pulse.populate('user', 'name username avatar');

    res.status(201).json(pulse);
  } catch (err) {
    console.error('Erro ao criar pulso:', err);
    res.status(500).json({ message: 'Erro ao criar pulso' });
  }
});

// ❤️ POST /api/pulses/:id/react — reagir com emoji
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji é obrigatório' });
    }

    const pulse = await Pulse.findByIdAndUpdate(
      req.params.id,
      { $push: { reactions: { user: req.userId, emoji } } },
      { new: true }
    );

    if (!pulse) {
      return res.status(404).json({ message: 'Pulso não encontrado' });
    }

    res.json(pulse);
  } catch (err) {
    console.error('Erro ao reagir:', err);
    res.status(500).json({ message: 'Erro ao reagir' });
  }
});

// 🗑️ DELETE /api/pulses/:id — deletar pulso (só o dono)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pulse = await Pulse.findById(req.params.id);

    if (!pulse) {
      return res.status(404).json({ message: 'Pulso não encontrado' });
    }

    if (pulse.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Você não pode deletar pulso de outra pessoa' });
    }

    await pulse.deleteOne();
    res.json({ message: 'Pulso deletado' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ message: 'Erro ao deletar pulso' });
  }
});

module.exports = router;
