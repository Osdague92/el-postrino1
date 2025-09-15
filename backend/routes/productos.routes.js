const express = require('express');
const router = express.Router();
const { getPostres, getToppings } = require('../controllers/productos.controller');

router.get('/postres', getPostres);
router.get('/toppings', getToppings);

module.exports = router;
