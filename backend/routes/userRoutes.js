const express = require('express');

const router = express.Router();

// Import Controller
// const { createComment } = require("../controllers/commentController");
const { createUser, getallUser, eraseAlluser, findUser, getUser, eraseUser } = require('../controllers/userController');
const { protectRoute } = require('../middleware/protectRoute');



// Mapping Create
router.post("/create", createUser);
router.get("/get", protectRoute, getallUser);
router.delete("/erase", eraseAlluser);
router.post("/find", findUser);
router.get('/:id', protectRoute, getUser);
// Logout route
router.post('/logout', protectRoute, eraseUser);



// Export Controller
module.exports = router;