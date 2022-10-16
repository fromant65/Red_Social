const User = require('../model/User')
const bcrypt = require('bcrypt');

const comparePasswords = async (req, res) => {
    //Esta funcion obtiene una contraseña del usuario enviada desde el frontend 
    //y la compara con la contraseña guardada en la DB
    const user = req.session.userid;
    const pwd = req.body.password;
    if (!pwd) return res.status(400).json({ 'message': 'Password is required' });
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.json({ 'message': 'Username not found' }).status(401)
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    //if the passwords are the same, we return true. If not, we return false
    if (match) res.json({ res: true });
    else res.json({ res: false });
}

const updatePassword = async (req, res) => {
    //Esta función recibe una contraseña enviada desde el frontend y actualiza la DB con ella
    const user = req.session.userid;
    const pwd = req.body.password;
    if (!pwd) return res.status(400).json({ 'error': 'Password is required' });
    try {
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //Update password
        const result = await User.findOneAndUpdate({ 'username': user }, { 'password': hashedPwd })
        res.status(201).json({ 'success': `Password has been updated` });
    } catch (err) {
        res.status(500).json({ 'error': err.message })
    }
}

module.exports = { comparePasswords, updatePassword }