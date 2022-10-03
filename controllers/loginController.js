const User = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin= async (req,res)=>{
    const user = req.body.username;
    const pwd = req.body.password;
    if(!user || !pwd) return res.status(400).json({'message':'Username and Password are required'});
    const foundUser = await User.findOne({username: user}).exec();
    if(!foundUser) return res.json({'message':'Username not found'}).status(401) //Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    //console.log(await bcrypt.compare(pwd, foundUser.password));
    if(match){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        const roles=Object.values(foundUser.roles);
        res.redirect('/home');
    }else{
        res.json({'message': 'The password is incorrect. Try again.'}).status(401);
    }
}

module.exports = {handleLogin}