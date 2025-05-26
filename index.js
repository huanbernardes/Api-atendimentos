const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { conexao, tabelas } = require('./bd_sql');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar token JWT
function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = decoded;
    next();
  });
}

// Rotas Auth
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Página atendimentos (HTML estático)
app.get('/atendimentos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'atendimentos.html'));
});
// READ ALL
app.get('/api/atendimentos', async (req, res) => {
  try {
    const [results] = await conexao.query('SELECT * FROM atendimentos');
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// === ROTAS CRUD ===

// CREATE
app.post('/api/atendimentos', async (req, res) => {
  try {
    const { data_atendimento, servico, cliente, status } = req.body;
    const sql = 'INSERT INTO atendimentos (data_atendimento, servico, cliente, status) VALUES (?, ?, ?, ?)';
  const [result] = await conexao.query(sql, [data_atendimento, servico, cliente, status || 'Ativo']);
    res.status(201).json({ id: result.insertId, data_atendimento, servico, cliente, status });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// READ BY ID
app.get('/api/atendimentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await conexao.query('SELECT * FROM atendimentos');
    if (result.length === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
app.put('/api/atendimentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data_atendimento, servico, cliente, status } = req.body;
    const sql = 'UPDATE atendimentos SET data_atendimento = ?, servico = ?, cliente = ?, status = ? WHERE id = ?';
  const [result] = await conexao.query(sql, [data_atendimento, servico, cliente, status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json({ mensagem: 'Atualizado com sucesso', id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE
app.delete('/api/atendimentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conexao.query('DELETE FROM atendimentos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json({ mensagem: 'Deletado com sucesso', id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Inicializa tabelas e servidor
async function start() {
  try {
    await tabelas.init();
    console.log('Tabelas inicializadas');

    // Testa conexão
    await conexao.getConnection();
    console.log('Conectado ao banco MySQL');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err.message);
  }
}

start();
