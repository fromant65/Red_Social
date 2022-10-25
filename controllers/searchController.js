const User = require('../model/User');
const {verifySession} = require('../middleware/verifySession');

const searchUsers = async (req,res)=>{
    verifySession(req,res);
    const user=req.params.string;
    const regExp = new RegExp("^"+ user);
    const users = await User.find({ username: regExp}).exec();
    if (!users) res.status(204);
    res.status(200).json(users);
}

module.exports = {searchUsers};