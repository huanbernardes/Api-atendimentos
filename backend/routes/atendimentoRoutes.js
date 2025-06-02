const express = require('express');
const router = express.Router();
const { conexao } = require('../models/bd_sql');

// Listar todos
router.get('/', async (req, res) => {
  try {
    const [results] = await conexao.query('SELECT * FROM atendimentos');
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar
router.post('/', async (req, res) => {
  try {
    const { data_atendimento, hora, servico, cliente } = req.body;
    if (!data_atendimento || !hora || !servico || !cliente) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }
    await conexao.query(
      'INSERT INTO atendimentos (data_atendimento, hora, servico, cliente) VALUES (?, ?, ?, ?)',
      [data_atendimento, hora, servico, cliente]
    );
    res.status(201).json({ mensagem: 'Atendimento criado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conexao.query('SELECT * FROM atendimentos WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data_atendimento, servico, cliente, hora } = req.body;
    const sql = 'UPDATE atendimentos SET data_atendimento = ?, servico = ?, cliente = ?, hora = ? WHERE id = ?';
    const [result] = await conexao.query(sql, [data_atendimento, servico, cliente, hora, id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json({ mensagem: 'Atualizado com sucesso', id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conexao.query('DELETE FROM atendimentos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json({ mensagem: 'Deletado com sucesso', id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
