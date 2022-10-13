const express = require('express');
const router = express.Router();
const path = require('path');
const profileController = require('../controllers/profileController');

router.get('^/$|/index(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

router.get('/login(.html)?', (req,res)=>{
    let session=req.session;
    if(session.userid) res.redirect('/home')
    else res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
})

router.get('/register(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'))
})

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/config', (req,res)=>{
    let session = req.session;
    if(session.userid) res.sendFile(path.join(__dirname, '..', 'views', 'config.html'));
    else res.redirect('/login');
})

router.get('/profile', (req,res)=>{
    let session = req.session;
    if(session.userid) res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'))
    else res.redirect('/login');
})

router.get('/user-info', profileController.getUserInfo)

module.exports = router