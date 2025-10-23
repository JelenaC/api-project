const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const { getUsers, postUsers, signIn } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/users', protect, adminOnly, getUsers);
router.post('/users', upload.single('pic'), postUsers); // tell Multer you expect a single file with the key "pic"
router.post('/users/signin', signIn);
module.exports = router;
