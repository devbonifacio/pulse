const mongoose = require('mongoose');

// Schema = "molde" de como um usuário é guardado no banco
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  username:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true }, // será o hash bcrypt, nunca a senha pura
  avatar:    { type: String, default: null },
  bio:       { type: String, default: '' },
  circles:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mood:      { emoji: String, date: Date },
}, { timestamps: true }); // cria createdAt e updatedAt automático

module.exports = mongoose.model('User', UserSchema);
