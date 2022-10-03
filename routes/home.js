const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req,res)=>{
    let session=req.session;
    if(session.userid) res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
    else res.redirect('/login'); 
})

module.exports = router;