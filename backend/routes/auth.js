const express = require('express');
const router = express.Router();

const { verificarToken: autenticar, verificarAdmin } = require('../middlewares/authMiddleware');

const authController = require('../controllers/authController');
const { conexao } = require('../models/bd_sql');

// ROTAS DE AUTENTICAÇÃO
router.post('/register', authController.register);
router.post('/login', authController.login);

// ROTAS DE ATENDIMENTOS

// LISTAR atendimentos (qualquer usuário autenticado)
router.get('/atendimentos', autenticar, async (req, res) => {
  try {
    const [dados] = await conexao.query('SELECT * FROM atendimentos');
    res.json(dados);
  } catch (erro) {
    console.error('Erro ao listar atendimentos:', erro);
    res.status(500).json({ erro: 'Erro ao listar atendimentos' });
  }
});

// ADICIONAR atendimento (usuário autenticado, mas não define STATUS)
router.post('/atendimentos', autenticar, async (req, res) => {
  const { Servico, cliente, DATA, hora } = req.body;
  try {
    // STATUS não entra aqui, será controlado pelo admin
    const sql = 'INSERT INTO atendimentos (Servico, cliente, DATA, hora) VALUES (?, ?, ?, ?)';
    await conexao.query(sql, [Servico, cliente, DATA, hora]);
    res.status(201).json({ mensagem: 'Atendimento adicionado com sucesso' });
  } catch (erro) {
    console.error('Erro ao adicionar atendimento:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar atendimento' });
  }
});

// ATUALIZAR atendimento (somente admin pode alterar STATUS)
router.put('/atendimentos/:id', autenticar, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const { Servico, cliente, DATA, STATUS, hora } = req.body;
  try {
    const sql = 'UPDATE atendimentos SET Servico = ?, cliente = ?, DATA = ?, STATUS = ?, hora = ? WHERE id = ?';
    await conexao.query(sql, [Servico, cliente, DATA, STATUS, hora, id]);
    res.json({ mensagem: 'Atendimento atualizado com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar atendimento:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar atendimento' });
  }
});

// EXCLUIR atendimento (usuário autenticado)
router.delete('/atendimentos/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM atendimentos WHERE id = ?';
    await conexao.query(sql, [id]);
    res.json({ mensagem: 'Atendimento excluído com sucesso' });
  } catch (erro) {
    console.error('Erro ao excluir atendimento:', erro);
    res.status(500).json({ erro: 'Erro ao excluir atendimento' });
  }
});

// ROTA ADMIN (exemplo)
router.get('/admin/dashboard', autenticar, verificarAdmin, (req, res) => {
  res.send('Bem-vindo ao painel de administração');
});

module.exports = router;
