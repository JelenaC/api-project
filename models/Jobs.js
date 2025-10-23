const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  salary: { type: Number },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Job', jobSchema);
