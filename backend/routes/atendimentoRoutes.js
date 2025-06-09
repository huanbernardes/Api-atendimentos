const express = require('express');
const router = express.Router();
const atendimentoController = require('../controllers/atendimentoController');
const { verificarToken } = require('../middlewares/authMiddleware');
router.get('/', verificarToken, atendimentoController.listar);
router.post('/', verificarToken, atendimentoController.criar);
router.get('/:id', verificarToken, atendimentoController.buscarPorId);
router.put('/:id', verificarToken, atendimentoController.atualizar);
router.delete('/:id', verificarToken, atendimentoController.deletar);

module.exports = router;
