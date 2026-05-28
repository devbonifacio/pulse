const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:    { type: String, required: true },
  type:       { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  seenAt:     { type: Date, default: null },
  disappears: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
