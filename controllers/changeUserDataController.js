const User = require('../model/User')

const updateUserData = async (req, res) => {
    const user = req.session.userid
    const newEmail = req.body.newEmail;
    const newFullName = req.body.newFullName;
    try {
        let updateData = {};
        if(newEmail) updateData.email = newEmail;
        if(newFullName) updateData.fullname = newFullName;
        if(updateData){
            const result = await User.findOneAndUpdate({ 'username': user }, updateData)
        };
        res.status(201).json({ 'success': `User data has been updated` });
    } catch (err) {
        res.status(500).json({ 'error': err.message })
    }
}

module.exports = { updateUserData }