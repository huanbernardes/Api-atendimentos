const AtendimentoModel = require('../models/atendimentoModel');
const { conexao } = require('../models/bd_sql');

module.exports = {
  listar: async (req, res) => {
    try {
      const { id, is_admin } = req.usuario;
      const atendimentos = await AtendimentoModel.listar(id, is_admin);
      res.json(atendimentos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { data, hora, servico, cliente_id } = req.body;
      const usuario_id = req.usuario.id;

      if (!data || !hora || !servico || !cliente_id) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
      }

      const result = await AtendimentoModel.criar(data, hora, servico, cliente_id, usuario_id);
      res.status(201).json({ mensagem: 'Atendimento criado com sucesso', result });
    } catch (error) {
      res.status(500).json({ mensagem: 'Erro ao criar atendimento', erro: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const { id: usuario_id, is_admin } = req.usuario;

      const result = await AtendimentoModel.buscarPorId(id, usuario_id, is_admin);
      if (result.length === 0)
        return res.status(404).json({ mensagem: 'Atendimento não encontrado' });

      res.json(result[0]);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, servico, cliente_id, hora } = req.body;
      const usuario_id = req.usuario.id;
      const is_admin = req.usuario.is_admin;

      const [check] = await AtendimentoModel.verificarDono(id);
      if (check.length === 0)
        return res.status(404).json({ mensagem: 'Atendimento não encontrado' });

      if (!is_admin && check[0].usuario_id !== usuario_id)
        return res.status(403).json({ mensagem: 'Sem permissão para alterar este atendimento' });

      await AtendimentoModel.atualizar(id, data, servico, cliente_id, hora);
      res.json({ mensagem: 'Atualizado com sucesso', id });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;
      const is_admin = req.usuario.is_admin;

      const [check] = await AtendimentoModel.verificarDono(id);
      if (check.length === 0)
        return res.status(404).json({ mensagem: 'Atendimento não encontrado' });

      if (!is_admin && check[0].usuario_id !== usuario_id)
        return res.status(403).json({ mensagem: 'Sem permissão para excluir este atendimento' });

      await AtendimentoModel.deletar(id);
      res.json({ mensagem: 'Deletado com sucesso', id });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
};
