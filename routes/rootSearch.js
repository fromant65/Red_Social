const express = require('express');
const router = express.Router();
const path = require('path');
const searchController = require('../controllers/searchController')

router.get('/search-user/:string', searchController.searchUsers);
router.get('/search-user/', searchController.searchUsers);

module.exports=router;