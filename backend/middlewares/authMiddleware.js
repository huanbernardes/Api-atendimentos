const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensagem: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mensagem: 'Token inválido' });

    req.user = decoded;
    next();
  });
}

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ mensagem: 'Apenas administradores podem acessar' });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarAdmin
};
