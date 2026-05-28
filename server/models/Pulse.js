const mongoose = require('mongoose');

const PulseSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl:   { type: String, required: true },
  caption:    { type: String, default: '', maxlength: 280 },
  mood:       { type: String, default: '' },

  // Círculo que pode ver esse pulso
  circle: {
    type: String,
    enum: ['intimate', 'friends', 'acquaintances', 'all'],
    default: 'friends',
  },

  // Quem reagiu e com qual emoji
  reactions: [{
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String,
  }],

  // Pulso expira em 24h (comportamento estilo BeReal/Stories)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
}, { timestamps: true });

// Índice TTL: MongoDB apaga o documento automaticamente quando expiresAt passa 🕐
PulseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Pulse', PulseSchema);
