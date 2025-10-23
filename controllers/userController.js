const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinaryConfig');

exports.postUsers = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const pic = req.file;
    console.log('🧾 Incoming data:', { name, email, hasFile: !!pic });
    console.log('📁 req.file:', req.file);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }
    let picUrl = '';
    // if (pic) {
    //   console.log('📸 Uploading to Cloudinary...');
    //   const uploadResult = await cloudinary.uploader.upload(
    //     `data: ${pic.mimetype};base64,${pic.buffer.toString('base64')}`,
    //     { folder: 'profile_pics' }
    //   );
    //   console.log('✅ Upload successful:', uploadResult.secure_url);
    //   picUrl = uploadResult.secure_url;
    // }
    if (pic) {
      console.log('📸 Uploading to Cloudinary via stream...');
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profile_pics' },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(pic.buffer); // pipe your buffer to the upload_stream
      });

      console.log('✅ Upload successful:', uploadResult.secure_url);
      picUrl = uploadResult.secure_url;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, pic: picUrl });
    await user.save();
    res.status(201).json({ message: 'User is saved in DB successfully' });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid creddentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid creddentials' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
