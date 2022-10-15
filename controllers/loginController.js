const User = require('../model/User')
const bcrypt = require('bcrypt');

const handleLogin= async (req,res)=>{
    const user = req.body.username;
    const pwd = req.body.password;
    if(!user || !pwd) return res.status(400).json({'message':'Username and Password are required'});
    const foundUser = await User.findOne({username: user}).exec();
    const foundMail = await User.findOne({email: user}).exec();
    if(!foundUser && !foundMail) return res.json({'message':'Username not found'}).status(401) //Unauthorized
    //evaluate password
    let matchUser, matchEmail;
    if(foundUser) matchUser = await bcrypt.compare(pwd, foundUser.password);
    if(foundMail) matchEmail = await bcrypt.compare(pwd, foundMail.password);
    //console.log(await bcrypt.compare(pwd, foundUser.password));
    if(matchUser || matchEmail){
        session=req.session;
        session.userid=foundUser?.username || foundMail?.username;
        session.email=foundUser?.email || foundMail?.email;
        console.log(req.session)
        //const roles=Object.values(foundUser.roles);
        res.redirect('/home');
    }else{
        res.json({'message': 'The password is incorrect. Try again.'}).status(401);
    }
}

module.exports = {handleLogin}