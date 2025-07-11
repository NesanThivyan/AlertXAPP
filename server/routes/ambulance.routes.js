import express from 'express';
import Ambulance from '../models/ambulance.model.js';

const router = express.Router();

// Get all ambulances
router.get('/', async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json(ambulances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create ambulance
router.post('/', async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body);
    await ambulance.save();
    res.status(201).json(ambulance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update ambulance
router.put('/:id', async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ambulance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete ambulance
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;            // ➊ extract id
    const ambulance = await Ambulance.findById(id);

    if (!ambulance) {                     // ➋ not found
      return res.status(404).json({ message: 'Ambulance not found' });
    }

    await ambulance.deleteOne();          // ➌ remove
    res.json({ message: 'Ambulance deleted successfully', id });
  } catch (err) {                         // ➍ bad id / other error
    console.error(err);
    res.status(400).json({ error: 'Invalid ID format or deletion failed' });
  }
});

export default router;
