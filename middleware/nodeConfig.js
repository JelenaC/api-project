const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); //initialize .env file

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  connectionTimeout: 10000,
});

module.exports = transporter;
