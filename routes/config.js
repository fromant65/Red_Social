const express = require('express');
const router = express.Router();
const path = require('path');
const changePasswordController = require('../controllers/changePasswordController')
const changeUserDataController = require('../controllers/changeUserDataController')

router.post('/check-password', changePasswordController.comparePasswords)

router.post('/update-password', changePasswordController.updatePassword)

router.post('/update-user-data', changeUserDataController.updateUserData)

module.exports = router;