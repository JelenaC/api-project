const Jobs = require('../models/Jobs');
const User = require('../models/Users');
const fs = require('fs');
const transporter = require('../middleware/nodeConfig');
const path = require('path');

exports.postJob = async (req, res) => {
  try {
    const job = await Jobs.create(req.body);
    const employees = await User.find({ role: 'employee' });
    const templatePath = path.join(__dirname, 'Email.html'); // construct full path with current directory and email.html file
    let emailTemplate = fs.readFileSync(templatePath, 'utf-8'); // read the file as utf-8 encoded string
    emailTemplate = emailTemplate
      .replace('{{jobTitle}}', job.title)
      .replace('{{company}}', job.company)
      .replace('{{location}}', job.location)
      .replace('{{salary}}', job.salary)
      .replace('{{createdAt}}', new Date(job.createdAt).toLocaleDateString());
    for (let employee of employees) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: employee.email,
        subject: 'New Job Opportunity Posted!',
        html: emailTemplate,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.postJob = async (req, res) => {
//   try {
//     console.log(req.body, 'body');
//     const job = await Jobs.create(req.body);
//     console.log(job, 'job>>>>');
//     const employees = await User.find({ role: 'employee' });
//     console.log(employees, 'employees');
//     const templatePath = path.join(__dirname, 'Email.html');
//     let emailTemplate = fs.readFileSync(templatePath, 'utf8');
//     emailTemplate = emailTemplate
//       .replace('{{jobTitle}}', job.title)
//       .replace('{{company}}', job.company)
//       .replace('{{location}}', job.location)
//       .replace('{{salary}}', job.salary)
//       .replace('{{createdAt}}', new Date(job.createdAt).toLocaleDateString());
//     for (let employee of employees) {
//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: employee.email,
//         subject: 'New Job Opportunity Posted!',
//         html: emailTemplate,
//       };
//       await transporter.sendMail(mailOptions);
//     }

//     res.status(201).json(job);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

exports.getAllJobs = async (req, res) => {
  //const jobs = await Jobs.find();
  try {
    const search = req.query.search;
    const filter = {};
    if (req.query.location) filter.location = req.query.location;
    // Add search filter only if search query exists
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const sortBy = req.query.sort || '-createdAt';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit; // Calculates how many documents to skip in the database query. If page=2 and limit=3, then skip the first 3 results.
    //Runs both queries in parallel for better performance.
    // const [jobs, totalJobs] = await Promise.all([
    //   Jobs.find(filter).sort(sortBy).skip(skip).limit(limit),
    //   Jobs.countDocuments(),
    // ]);
    const jobs = await Jobs.find(filter).sort(sortBy).skip(skip).limit(limit);
    res.json({
      success: true,
      //   total: totalJobs,
      //   page,
      //   limit,
      data: jobs,
    });
  } catch (err) {
    //next(err);
    console.log('Error:', err.message);
  }
};

exports.fetchSingleJob = async (req, res) => {
  const job = await Jobs.findById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  res.json(job);
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Jobs.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
