const express = require('express');
const { resetPassword,newPassword } = require('../controller/resetPasswordController');
const router = express.Router();

router.post('/', resetPassword);
router.post('/:token',newPassword)

module.exports = router;