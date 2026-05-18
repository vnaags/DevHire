const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');
const SEED    = require('../data/jobs');

router.get('/', async (req, res) => {
  try {
    const { search, type, category } = req.query;
    const q = {};
    if (search) q.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { company:  { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
    if (type)     q.type     = type;
    if (category) q.category = category;
    const jobs = await Job.find(q).sort({ featured: -1, createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const existing = await Job.countDocuments();
    if (existing > 0) return res.json({ message: `Already has ${existing} jobs.`, count: existing });
    const jobs = await Job.insertMany(SEED);
    res.status(201).json({ message: `Seeded ${jobs.length} jobs!`, count: jobs.length });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error creating job', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: 'Error updating job', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
});

module.exports = router;