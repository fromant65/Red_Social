const express = require('express');
const router = express.Router();
const path = require('path');
const followerController = require('../controllers/followerController')

router.get('/get-followed/:username', followerController.getFollowed)
router.get('/get-followers/:username', followerController.getFollowers)

module.exports = router;