const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'db');

// Helper function to read data from JSON files
const readData = async (fileName) => {
  try {
    const filePath = path.join(dataPath, fileName);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
};

// Helper function to write data to JSON files
const writeData = async (fileName, data) => {
  try {
    const filePath = path.join(dataPath, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error);
  }
};

// Endpoints
app.get('/postres', async (req, res) => {
  const postres = await readData('postres.json');
  res.json(postres);
});

app.get('/toppings', async (req, res) => {
  const toppings = await readData('toppings.json');
  res.json(toppings);
});

app.post('/pedidos', async (req, res) => {
  const { usuarioId, postresPersonalizados } = req.body;

  if (!usuarioId || !postresPersonalizados) {
    return res.status(400).json({ message: 'usuarioId and postresPersonalizados are required' });
  }

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

  // Update user's order history
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
});

app.get('/pedidos/:id', async (req, res) => {
  const pedidos = await readData('pedidos.json');
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) {
    return res.status(404).json({ message: 'Pedido not found' });
  }
  res.json(pedido);
});

app.get('/usuarios/:id/pedidos', async (req, res) => {
  const usuarios = await readData('usuarios.json');
  const user = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const pedidos = await readData('pedidos.json');
  const userPedidos = pedidos.filter(p => user.historialPedidos.includes(p.id));
  res.json(userPedidos);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ message: 'nombre and email are required' });
  }

  const usuarios = await readData('usuarios.json');
  const newUser = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre,
    email,
    historialPedidos: []
  };

  usuarios.push(newUser);
  await writeData('usuarios.json', usuarios);

  res.status(201).json(newUser);
});

app.get('/usuarios/:id', async (req, res) => {
  const usuarios = await readData('usuarios.json');
  const user = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
