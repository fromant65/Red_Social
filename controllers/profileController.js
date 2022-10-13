const User = require('../model/User');
const Post = require('../model/Post');

const getUserInfo = async (req,res)=>{
    const user = req.session.userid;
    const data = await User.findOne({username: user}).exec();
    if(data) res.status(200).json({user:data});
    else res.status(404).json({'message':'User not found'});
}

module.exports = {
    getUserInfo
}