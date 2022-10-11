const express = require('express');
const router = express.Router();
const path = require('path');
const changePasswordController = require('../controllers/changePasswordController')

router.post('/check-password', changePasswordController.comparePasswords)

router.post('/update-password', changePasswordController.updatePassword)

module.exports = router;