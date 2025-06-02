const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

//  Lista todos os clientes
router.get('/', clienteController.listarTodos);

//  Busca um cliente por ID
router.get('/:id', clienteController.buscarPorId);

// Cria um novo cliente
router.post('/', clienteController.criar);

//  Atualiza um cliente existente
router.put('/:id', clienteController.atualizar);

// Deleta um cliente
router.delete('/:id', clienteController.deletar);

module.exports = router;
