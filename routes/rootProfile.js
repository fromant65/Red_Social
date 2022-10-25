const express = require('express');
const router = express.Router();
const path = require('path');
const profileController = require('../controllers/profileController');

router.post('/profile/seguir', profileController.follow)

router.get('/user-info/:username', profileController.getUserInfo)

router.get('/user-publicaciones/:username', profileController.getUserPosts)

module.exports = router;