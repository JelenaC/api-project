const jwt = require('jsonwebtoken');
const User = require('../models/Users');
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1]; // get just the token part without Bearer string
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select('-password'); // look for the user in mongodb with the decoded token, and remove the password from the result for the security.
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    req.user = user; // attach the authenticated user to the request
    next(); // call next() to continue to the actual route function
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin only' });
  }
};
