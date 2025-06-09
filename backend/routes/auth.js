const express = require('express');
const router = express.Router();

const { verificarToken: autenticar, verificarAdmin } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const { conexao } = require('../models/bd_sql');
const { buscarAtendimentosPorUsuario } = require('../controllers/clienteController');

// ROTAS DE AUTENTICAÇÃO
router.post('/register', authController.register);
router.post('/login', authController.login);


// LISTAR atendimentos
router.get('/atendimentos', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const atendimentos = await buscarAtendimentosPorUsuario(usuarioId);
    res.json(atendimentos);
  } catch (erro) {
    console.error('Erro ao buscar atendimentos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar atendimentos' });
  }
});

// CRIAR atendimento
router.post('/atendimentos', autenticar, async (req, res) => {
  const { servico, cliente_id, data, hora } = req.body;
  const usuarioId = req.usuario.id;

  try {
    console.log('Inserindo atendimento:', { servico, cliente_id, data, hora, usuarioId });
    const sql = 'INSERT INTO atendimentos (servico, cliente_id, data, hora, usuario_id) VALUES (?, ?, ?, ?, ?)';
    await conexao.query(sql, [servico, cliente_id, data, hora, usuarioId]);
    res.status(201).json({ mensagem: 'Atendimento adicionado com sucesso' });
  } catch (erro) {
    console.error('Erro ao adicionar atendimento:', erro);
    res.status(500).json({ erro: erro.message });
  }
});

// ATUALIZAR atendimento (admin)
router.put('/atendimentos/:id', autenticar, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const { servico, cliente_id, data, status, hora } = req.body;

  try {
    const sql = 'UPDATE atendimentos SET servico = ?, cliente_id = ?, data = ?, status = ?, hora = ? WHERE id = ?';
    await conexao.query(sql, [servico, cliente_id, data, status, hora, id]);
    res.json({ mensagem: 'Atendimento atualizado com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar atendimento:', erro);
    res.status(500).json({ erro: erro.message });
  }
});

// DELETAR atendimento (usuário dono)
router.delete('/atendimentos/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    const [rows] = await conexao.query(
      'SELECT * FROM atendimentos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ erro: 'Ação não autorizada: Atendimento não é seu.' });
    }

    await conexao.query('DELETE FROM atendimentos WHERE id = ?', [id]);
    res.json({ mensagem: 'Atendimento excluído com sucesso' });
  } catch (erro) {
    console.error('Erro ao excluir atendimento:', erro);
    res.status(500).json({ erro: 'Erro ao excluir atendimento' });
  }
});

// PAINEL ADMIN
router.get('/admin/dashboard', autenticar, verificarAdmin, (req, res) => {
  res.send('Bem-vindo ao painel de administração');
});

module.exports = router;
