const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

const { conexao, tabelas } = require('./models/bd_sql');
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/clienteRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');
const { verificarToken, verificarAdmin } = require('./middlewares/authMiddleware');


const app = express();

// Middleware de aplicação
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas públicas
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/api/atendimentos', atendimentoRoutes);

// Página de atendimentos (frontend)
app.get('/atendimentos', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'atendimentos.html'));
});

// Rota protegida: listar usuários (somente admins)
app.get('/usuarios', verificarAdmin, async (req, res) => {
  try {
    const [usuarios] = await conexao.query('SELECT id, nome, email, is_admin FROM usuarios');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Inicializar servidor
async function start() {
  try {
    await tabelas.init();
    console.log('Tabelas inicializadas');

    await conexao.getConnection();
    console.log('Conectado ao banco MySQL');

    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err.message);
  }
}

start();
