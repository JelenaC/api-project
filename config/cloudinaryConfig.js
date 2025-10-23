const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
  debug: true,
});
console.log('🌩️ Cloudinary config:', cloudinary.config());

module.exports = cloudinary;
