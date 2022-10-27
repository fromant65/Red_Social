const express = require('express');
const router = express.Router();
const path = require('path');

router.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({error:"404 no encontrado"})
    }else{
        res.type('txt').send("404 no encontrado")
    }
})

module.exports = router;