const mongoose = require('mongoose');
const dbUri = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`MongoDB connected: ${dbConnection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDb: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
