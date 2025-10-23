const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/Users');
const dotenv = require('dotenv');
dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
  });
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin123@gmail.com',
    password: hashedPassword,
    role: 'admin',
  });
  console.log('admin user created successfully');
  process.exit();
};

seedAdmin().catch((error) => {
  console.log(error);
  process.exit(1);
});

//run node seedAdmin.js in the terminal
