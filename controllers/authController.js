require('dotenv').config();
const { conexao } = require('../bd_sql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  login: async (req, res) => {
    const { email, senha } = req.body;
    try {
      const [usuarios] = await conexao.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      const user = usuarios[0];

      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const senhaCorreta = await bcrypt.compare(senha, user.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
      console.log('Segredo JWT:', process.env.JWT_SECRET);

  const token = jwt.sign(
  { id: user.id, is_admin: user.is_admin },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);


      res.json({ token });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  register: async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      await conexao.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
      res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  }
};
