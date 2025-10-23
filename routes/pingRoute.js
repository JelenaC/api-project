//Import Express library (used for building web servers in Node.js).
const express = require('express');

//Create a router
//Instead of creating a whole server, this creates a mini “sub-app” (a router)
// that you can attach to your main server later.
//Routers help organize your routes into separate files — which keeps your project clean and modular.
const router = express.Router();

//Import controller function - This pulls in a function named getPing from another file —
// usually one that handles the logic for this route (e.g., deciding what data to send back).
const { getPing } = require('../controllers/pingController');

//Define a route - “When someone sends a GET request to /ping, run the getPing function.”
//For example, if the main server mounts this router at /api, the full URL would be: localhost:3000/api/ping
router.get('/ping', getPing);
module.exports = router;
