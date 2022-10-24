/* ADMIN
USERNAME: fromant
PASSWORD: admin1234
*/
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn');
const sessions = require('express-session');
const PORT = process.env.PORT || 3500;
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions={
    secret: process.env.ACCESS_TOKEN_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}

//connect to Mongo DB
connectDB();

//Middleware
app.use(sessions(sessionOptions));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')))

//Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/home', require('./routes/home'))
app.use('/config', require('./routes/config'))

//Error 404
app.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({error:"404 no encontrado"})
    }else{
        res.type('txt').send("404 no encontrado")
    }
})

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

