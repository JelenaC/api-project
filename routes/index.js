const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(require('./pingRoute'));
router.use(require('./userRoute'));
router.use(protect); // from here onward every route needs authentication
router.use(require('./jobRoute'));
module.exports = router;
