const multer = require('multer');
const storage = multer.memoryStorage(); // uploaded file will be stored in ram memory, not saved to disk.
const upload = multer({ storage }); // created upload middleware, we can use this in routes to upload files
module.exports = upload;
