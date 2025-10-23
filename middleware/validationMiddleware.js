exports.validateJobData = async (req, res, next) => {
  const { title, company } = req.body;
  if (!title || !company) {
    return res.status(400).json({ message: 'Title and company are required' });
  }
  next();
};
