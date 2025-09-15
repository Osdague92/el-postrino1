const { readData, writeData } = require('../models/db');
const { validationResult } = require('express-validator');

const getUsuarioById = async (req, res) => {
  const usuarios = await readData('usuarios.json');
  const user = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

const createUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email } = req.body;

  const usuarios = await readData('usuarios.json');
  
  const existingUser = usuarios.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const newUser = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre,
    email,
    historialPedidos: []
  };

  usuarios.push(newUser);
  await writeData('usuarios.json', usuarios);

  res.status(201).json(newUser);
};

const getUsuarioPedidos = async (req, res) => {
    const usuarios = await readData('usuarios.json');
    const user = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const pedidos = await readData('pedidos.json');
    const userPedidos = pedidos.filter(p => user.historialPedidos.includes(p.id));
    res.json(userPedidos);
};

module.exports = {
  getUsuarioById,
  createUsuario,
  getUsuarioPedidos
};