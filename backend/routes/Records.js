const express = require('express');
const Record = require('../models/Record');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    console.error('Error fetching record by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const record = new Record({
    name: req.body.name,
    motto: req.body.motto,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    date: Date.now(),
  });

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error saving new record:', err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    record.name = req.body.name || record.name;
    record.motto = req.body.motto || record.motto;
    if (req.file) {
      record.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    await Record.deleteOne({ _id: req.params.id }); 
    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;