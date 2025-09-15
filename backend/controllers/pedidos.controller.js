const { readData, writeData } = require('../models/db');
const { validationResult } = require('express-validator');

const getPedidoById = async (req, res) => {
    const pedidos = await readData('pedidos.json');
    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
    if (!pedido) {
        return res.status(404).json({ message: 'Pedido not found' });
    }
    res.json(pedido);
};

const createPedido = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { usuarioId, postresPersonalizados } = req.body;

    const postres = await readData('postres.json');
    const toppings = await readData('toppings.json');

    let total = 0;
    for (const item of postresPersonalizados) {
        const postre = postres.find(p => p.id === item.postreId);
        if (!postre) {
            return res.status(400).json({ message: `Postre with id ${item.postreId} not found` });
        }

        let toppingsTotal = 0;
        if (item.toppingsIds) {
            for (const toppingId of item.toppingsIds) {
                const topping = toppings.find(t => t.id === toppingId);
                if (!topping) {
                    return res.status(400).json({ message: `Topping with id ${toppingId} not found` });
                }
                toppingsTotal += topping.precioAdicional;
            }
        }

        total += (postre.precioBase + toppingsTotal) * item.cantidad;
    }

    const pedidos = await readData('pedidos.json');
    const newPedido = {
        id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
        usuarioId,
        postresPersonalizados,
        total,
        estado: 'pendiente'
    };

    pedidos.push(newPedido);
    await writeData('pedidos.json', pedidos);

    const usuarios = await readData('usuarios.json');
    const user = usuarios.find(u => u.id === usuarioId);
    if (user) {
        if (!user.historialPedidos) {
            user.historialPedidos = [];
        }
        user.historialPedidos.push(newPedido.id);
        await writeData('usuarios.json', usuarios);
    }

    res.status(201).json(newPedido);
};

module.exports = {
    getPedidoById,
    createPedido
};