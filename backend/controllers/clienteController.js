const ClienteModel = require('../models/clienteModel');

module.exports = {
  async listarTodos(req, res) {
    try {
      const { id: usuario_id, is_admin } = req.usuario;

      let clientes;

      if (is_admin === 1 || is_admin === true) {
        // Admin vê todos os clientes
        clientes = await ClienteModel.listarTodos();
      } else {
        // Usuário normal vê apenas o cliente vinculado a ele (1 cliente)
        const cliente = await ClienteModel.buscarPorUsuarioId(usuario_id);
        clientes = cliente ? [cliente] : [];
      }

      res.json(clientes);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar clientes: ' + erro.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await ClienteModel.buscarPorId(id);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      res.json(cliente);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar cliente: ' + erro.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome, email, telefone } = req.body;
      const usuario_id = req.usuario.id;

      if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
      }

      const novoCliente = await ClienteModel.criar({ nome, email, telefone, usuario_id });
      res.status(201).json({
        mensagem: 'Cliente cadastrado com sucesso!',
        cliente: novoCliente
      });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar cliente: ' + erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nome, email, telefone } = req.body;

      if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios para atualizar' });
      }

      const clienteAtualizado = await ClienteModel.atualizar(id, { nome, email, telefone });
      res.json({
        mensagem: 'Cliente atualizado com sucesso!',
        cliente: clienteAtualizado
      });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar cliente: ' + erro.message });
    }
  },

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ClienteModel.deletar(id);
      res.json({ mensagem: 'Cliente deletado com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar cliente: ' + erro.message });
    }
  }
};
