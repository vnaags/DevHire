const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:        { type: String, required: [true, 'Job title is required'], trim: true },
  company:      { type: String, required: [true, 'Company name is required'], trim: true },
  companyDesc:  { type: String, default: '' },
  website:      { type: String, default: '' },
  founded:      { type: String, default: '' },
  employees:    { type: String, default: '' },
  location:     { type: String, required: [true, 'Location is required'], trim: true },
  type:         { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
  category:     { type: String, required: true, enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data', 'Design', 'Product'] },
  salary:       { type: String, default: '' },
  experience:   { type: String, default: '' },
  description:  { type: String, required: [true, 'Job description is required'] },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  niceToHave:   { type: [String], default: [] },
  featured:     { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
