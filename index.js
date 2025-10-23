const express = require('express');
const app = express();
const routes = require('./routes/index');
const connectDB = require('./dbConnection');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // limit api requests to protect server // max 100 request from 1 IP within 15 minutes time window expressed in miliseconds
app.use(express.json());
app.use(mongoSanitize()); // prevent NoSql injection, sanitize requests
app.use(xss()); // prevent attackers from injecting malicious scripts
app.use(limiter);
//app.use(cors({ origin: 'http://yourfrontend.com' })); // allow only your frontend to call your backend, no unauthorized api calls
app.use(cors({ origin: '*' })); // accessible from anywhere, because we don't have a frontend
app.use(helmet()); // protect against clickjacking, content sniffing. It hides framework details in headers
app.use('/api', routes);
connectDB();
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//index - main entry point, import packages like express, mongobd, connect to db, start server, connect to api routes
//routes - api route files, define api endpoint
//controllers - logic for each route - each route connects to a controller function - these functions tell the app what to do when someone calls an API
//models - data models for MongoDb
//config - config files ( db connection)
//middleware - authentication, error handlers

//MVC - way to organize code to keep project clean, simple and easy to manages as it grows
// M - Model - Handle data and db logic- connection to db, define how data should look
// V - View - for frontend
// C - Controller - handle route logic - what should happend when someone calls an API

// import express from 'express';
// import routes from './routes/index.js';
// import connectDB from './dbConnection.js';

// const app = express();

// // Connect to the database
// connectDB();

// // Use routes
// app.use('/api', routes);

// // Start server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
