const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUsuarioById, createUsuario, getUsuarioPedidos } = require('../controllers/usuarios.controller');

const usuarioValidationRules = [
  body('nombre').isString().trim().notEmpty().withMessage('nombre is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required')
];

router.get('/:id', getUsuarioById);
router.post('/', usuarioValidationRules, createUsuario);
router.get('/:id/pedidos', getUsuarioPedidos);

module.exports = router;
