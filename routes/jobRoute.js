const express = require('express');
const router = express.Router();
const { validateJobData } = require('../middleware/validationMiddleware');
const {
  postJob,
  getAllJobs,
  fetchSingleJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
router.post('/job', validateJobData, postJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', fetchSingleJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
module.exports = router;
