const { readData } = require('../models/db');

const getPostres = async (req, res) => {
    const postres = await readData('postres.json');
    res.json(postres);
};

const getToppings = async (req, res) => {
    const toppings = await readData('toppings.json');
    res.json(toppings);
};

module.exports = {
    getPostres,
    getToppings
};