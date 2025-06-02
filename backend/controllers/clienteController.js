const ClienteModel = require('../models/clienteModel');

module.exports = {
    async listarTodos(req, res) {
        try {
            const clientes = await ClienteModel.listarTodos();
            res.json(clientes);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao listar clientes' });
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
            res.status(500).json({ erro: 'Erro ao buscar cliente' });
        }
    },

    async criar(req, res) {
        try {
            const { nome, email, telefone } = req.body;
            const novoCliente = await ClienteModel.criar({ nome, email, telefone });
            res.status(201).json(novoCliente);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao criar cliente' });
        }
    },

    async atualizar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { nome, email, telefone } = req.body;
            const clienteAtualizado = await ClienteModel.atualizar(id, { nome, email, telefone });
            res.json(clienteAtualizado);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao atualizar cliente' });
        }
    },

    async deletar(req, res) {
        try {
            const id = parseInt(req.params.id);
            await ClienteModel.deletar(id);
            res.json({ mensagem: 'Cliente deletado com sucesso' });
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao deletar cliente' });
        }
    }
};
