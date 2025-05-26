const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const authController = require('../controllers/authController');
const conexao = require('../bd_sql');

// ROTAS DE AUTENTICAÇÃO
router.post('/register', authController.register);
router.post('/login', authController.login);

// ROTAS DE ATENDIMENTOS

// LISTAR atendimentos
router.get('/atendimentos', autenticar, async (req, res) => {
  try {
    const [dados] = await conexao.query('SELECT * FROM atendimentos');
    res.json(dados);
  } catch (erro) {
    console.error('Erro ao listar atendimentos:', erro);
    res.status(500).json({ erro: 'Erro ao listar atendimentos' });
  }
});

// ADICIONAR atendimento
router.post('/atendimentos', autenticar, async (req, res) => {
  const { Servico, cliente, DATA, STATUS } = req.body;
  try {
    const sql = 'INSERT INTO atendimentos (Servico, cliente, DATA, STATUS) VALUES (?, ?, ?, ?)';
    await conexao.query(sql, [Servico, cliente, DATA, STATUS]);
    res.status(201).json({ mensagem: 'Atendimentos adicionado com sucesso' });
  } catch (erro) {
    console.error('Erro ao adicionar atendimentos:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar atendimentos' });
  }
});

// ATUALIZAR atendimento
router.put('/atendimentos/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const { Servico, cliente, DATA, STATUS } = req.body;
  try {
    const sql = 'UPDATE atendimentos SET Servico = ?, cliente = ?, DATA = ?, STATUS = ? WHERE id = ?';
    await conexao.query(sql, [Servico, cliente, DATA, STATUS, id]);
    res.json({ mensagem: 'Atendimentos atualizado com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar atendimento:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar atendimento' });
  }
});

// EXCLUIR atendimento
router.delete('/atendimentos/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM atendimentos WHERE id = ?';
    await conexao.query(sql, [id]);
    res.json({ mensagem: 'Atendimentos excluído com sucesso' });
  } catch (erro) {
    console.error('Erro ao excluir atendimentos:', erro);
    res.status(500).json({ erro: 'Erro ao excluir atendimentos' });
  }
});

module.exports = router;
