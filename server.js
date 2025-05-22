const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vehicles')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Define Vehicle schema and model
const Vehicle = mongoose.model('Vehicle', {
  name: String,
  type: String
});

// API to get all vehicles
app.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
});

// API to add a vehicle
app.post('/vehicles', async (req, res) => {
  const { name, type } = req.body;
  const vehicle = new Vehicle({ name, type });
  await vehicle.save();
  res.json({ message: 'Vehicle added' });
});

// API to update a vehicle by ID
app.put('/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  await Vehicle.findByIdAndUpdate(id, { name, type });
  res.json({ message: 'Vehicle updated' });
});

// API to delete a vehicle by ID
app.delete('/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  await Vehicle.findByIdAndDelete(id);
  res.json({ message: 'Vehicle deleted' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
