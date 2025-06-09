const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT e anexar dados do usuário ao req
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica se o header Authorization existe e está no formato 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
    }

    // decoded deve conter as informações do usuário, ex: { id, nome, is_admin }
    req.usuario = decoded;
    next();
  });
}

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  if (req.usuario.is_admin !== 1) {
    return res.status(403).json({ mensagem: 'Apenas administradores podem acessar' });
  }

  next();
}

module.exports = {
  verificarToken,
  verificarAdmin
};
