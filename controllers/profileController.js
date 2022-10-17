const User = require('../model/User');
const Post = require('../model/Post');

const getUserInfo = async (req,res)=>{
    const user = req.params.username;
    const data = await User.findOne({username: user}).exec();
    if(data) res.status(200).json({user:data});
    else res.status(404).json({'message':'User not found'});
}

/*Funcion para obtener los posts de determinado usuario*/
const getUserPosts = async (req,res)=>{
    const userid = req.params.username;
    Post.find({ user: userid }).lean().exec((err, posts) => {
        if (!posts) res.status(204);
        return res.status(200).json(posts);
    });
}

module.exports = {
    getUserInfo,
    getUserPosts
}