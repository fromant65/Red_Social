const User = require('../model/User')
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    const user= req.body.username;
    const pwd = req.body.password;
    const email = req.body.email;
    const fullname = req.body.fullname;
    if(!user || !pwd || !email || !fullname) 
        return res.status(400).json({'message':'All fields are required'});
    // check for duplicate usernames in the database
    const duplicateUser = await User.findOne({username: user}).exec();
    const duplicateEmail = await User.findOne({email: email}).exec();
    if(duplicateUser) return res.status(409).json({'message':'Username already registered'}); //conflict
    if(duplicateEmail) return res.status(409).json({'message':'Email already registered'}); //conflict
    try{ 
        //encrypt pwd
        const hashedPwd = await bcrypt.hash(pwd,10);
        //create and store the new user
        const result = await User.create({
            'username': user, 
            'password': hashedPwd,
            'email': email,
            'fullname': fullname
        })
        res.status(201).json({'success': `New user ${user} created`});
    }catch(err){
        res.status(500).json({'message':err.message})
    }
}

module.exports = { handleNewUser}

