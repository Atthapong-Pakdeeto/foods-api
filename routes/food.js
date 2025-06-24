import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// GET: Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().sort({ id: 1 });
    const foodsWithId = foods.map((food) => ({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image
    }));
    res.json(foodsWithId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add new food
router.post('/', async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ message: 'Please provide name, price, and image.' });
  }
  try {
    const newFood = new Food({ name, price, image });
    await newFood.save();
    res.status(201).json({ id: newFood.id, name, price, image });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update food by id (use auto-increment id)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  try {
    const food = await Food.findOne({ id: Number(id) });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (name !== undefined) food.name = name;
    if (price !== undefined) food.price = price;
    if (image !== undefined) food.image = image;
    await food.save();
    res.json({ id: food.id, name: food.name, price: food.price, image: food.image });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Delete food by id (use auto-increment id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findOneAndDelete({ id: Number(id) });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
