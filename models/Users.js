const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['employer', 'admin', 'employee'],
    default: 'employer',
  },
  pic: String,
});
const User = mongoose.model('Users', userSchema); // wrapper around schema - model name and schema to follow
module.exports = User;
