const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getPedidoById, createPedido } = require('../controllers/pedidos.controller');

const pedidoValidationRules = [
  body('usuarioId').isInt({ min: 1 }).withMessage('usuarioId must be a positive integer'),
  body('postresPersonalizados').isArray({ min: 1 }).withMessage('postresPersonalizados must be a non-empty array'),
  body('postresPersonalizados.*.postreId').isInt({ min: 1 }).withMessage('postreId must be a positive integer'),
  body('postresPersonalizados.*.cantidad').isInt({ min: 1 }).withMessage('cantidad must be a positive integer'),
  body('postresPersonalizados.*.toppingsIds').optional().isArray().withMessage('toppingsIds must be an array'),
  body('postresPersonalizados.*.toppingsIds.*').isInt({ min: 1 }).withMessage('Each toppingId must be a positive integer')
];

router.get('/:id', getPedidoById);
router.post('/', pedidoValidationRules, createPedido);

module.exports = router;
