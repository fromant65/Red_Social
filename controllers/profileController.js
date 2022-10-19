const User = require('../model/User');
const Post = require('../model/Post');

const getUserInfo = async (req, res) => {
    const user = req.params.username;
    const data = await User.findOne({ username: user }).exec();
    if (data) res.status(200).json({ user: data });
    else res.status(404).json({ 'message': 'User not found' });
}

/*Funcion para obtener los posts de determinado usuario*/
const getUserPosts = async (req, res) => {
    const userid = req.params.username;
    Post.find({ user: userid }).lean().exec((err, posts) => {
        if (!posts) res.status(204);
        return res.status(200).json(posts);
    });
}

const follow = async (req, res) => {
    const followedId = req.body.userFollowed;
    const followerId = req.body.client;
    try {
        const followed = await User.findOne({ username: followedId }).exec();
        const follower = await User.findOne({ username: followerId }).exec();
        if (followed.followers.filter(follower => follower.username === followerId).length === 1) {
            //Si ya lo sigue, debe dejar de seguirlo
            const followerList = followed.followers.filter(follower => follower.username !== followerId);
            const followedList = follower.following.filter(followed => followed.username !== followedId);
            await User.findOneAndUpdate({ username: followedId }, { followers: followerList });
            await User.findOneAndUpdate({ username: followerId }, { following: followedList });
            res.status(200).json({ 'success': 'Follower removed' })
        } else {
            //Si no lo sigue, debemos agregar el seguidor
            followed.followers.push({ 'username': followerId });
            followed.save();
            follower.following.push({ 'username': followedId });
            follower.save();
            res.status(200).json({ 'success': 'Follower added' })
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

module.exports = {
    getUserInfo,
    getUserPosts,
    follow
}