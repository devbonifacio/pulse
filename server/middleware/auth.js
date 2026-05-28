const jwt = require('jsonwebtoken');

// Middleware = função que roda ANTES da rota principal
// Verifica se o usuário tem um token JWT válido
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Header vem no formato "Bearer xxx.yyy.zzz"
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // disponibiliza o ID em todas as rotas seguintes
    next(); // pode prosseguir
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
