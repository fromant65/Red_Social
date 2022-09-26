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
const PORT = process.env.PORT || 3500;

//connect to Mongo DB
connectDB();

//Middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')))

//Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

