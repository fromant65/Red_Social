const express = require('express');
const router = express.Router();
const path = require('path');
const postController = require('../controllers/postController')

router.get('/', (req,res)=>{
    let session=req.session;
    if(session.userid) res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
    else res.redirect('/login'); 
})

router.get('/publicar', (req,res)=>{
    let session = req.session;
    res.json({session});
})

router.post('/publicar', postController.handleNewPost);

router.post('/publicaciones', postController.showPosts)

module.exports = router;