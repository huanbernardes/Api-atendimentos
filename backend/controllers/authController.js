require('dotenv').config();
const { conexao } = require('../models/bd_sql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const clienteModel = require('../models/clienteModel');

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

      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        mensagem: 'Login realizado com sucesso',
        token,
        is_admin: user.is_admin,
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  register: async (req, res) => {
    const { nome, email, senha, telefone } = req.body;

    try {
      // Verifica se email já existe
      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criptografa senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria usuário
      const usuarioCriado = await usuarioModel.criar({ nome, email, senha: senhaHash });

      // Cria cliente vinculado ao usuário
      const clienteCriado = await clienteModel.criar({
        nome,
        email,
        telefone,
        usuario_id: usuarioCriado.id,
      });

      res.status(201).json({
        mensagem: 'Usuário e cliente criados com sucesso',
        usuario: usuarioCriado,
        cliente: clienteCriado,
      });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  },
};
