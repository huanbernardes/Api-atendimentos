const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');
const ClienteModel = require('../models/clienteModel');

module.exports = {
  async criarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
      }

      const novoUsuario = await UsuarioModel.criar({ nome, email, senha });

      const novoCliente = await ClienteModel.criar({
        nome,
        email,
        telefone: '',
        usuario_id: novoUsuario.id
      });

      res.status(201).json({ usuario: novoUsuario, cliente: novoCliente });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar usuário: ' + erro.message });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
      }

      const senhaValida = await UsuarioModel.verificarSenha(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Senha incorreta.' });
      }

      // Criar token JWT
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, is_admin: usuario.is_admin || false },
        process.env.JWT_SECRET || 'seusegredoaqui',
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro no login: ' + erro.message });
    }
  }
};
