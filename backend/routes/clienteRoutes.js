const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const clienteController = require('../controllers/clienteController');

router.use(verificarToken); // Todas as rotas precisam de autenticação

// Rotas para clientes
router.get('/', clienteController.listarTodos);
router.get('/:id', clienteController.buscarPorId);
router.post('/', clienteController.criar);  // crie essa função no controller (exemplo abaixo)
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.deletar);

module.exports = router;
