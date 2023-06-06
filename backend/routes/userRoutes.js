const express = require('express');
const { registerUser, loginUser, getUser, getAdmins } = require('../controller/userController');
const { AuthMiddleware } = require('../middlewares/authenticationMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-user',AuthMiddleware, getUser);
router.get('/get-admins',AuthMiddleware, getAdmins);

module.exports = router;