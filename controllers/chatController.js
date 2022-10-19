const Chat = require('../model/Chat')
const User = require('../model/User')
const {verifySession} = require('./verifySession');

const getChatsFromUser = async (req,res)=>{
    verifySession(req,res);
    const username = req.params.username;
    try{
        const user = await User.findOne({username: username}).exec();
        res.status(200).json({'chats':user.chats})
    }catch(err){
        res.status(500).json({'message': err.message})
    }   
}

const getChatParticipants = async (req,res)=>{
    verifySession(req,res);
    const id = req.params.id;
    try{
        const chat = await Chat.findById(id).exec();
        res.status(200).json({'participants':chat.participants})
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}

const getChatMessages = async (req,res)=>{
    verifySession(req,res);
    const id = req.params.id;
    try{
        const chat = await Chat.findById(id).exec();
        res.status(200).json({'messages':chat.messages})
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}

const createChat = async (req,res)=>{
    try{
        const chat = await Chat.create({participants:[]})
        chat.participants.push({'username':req.body.targetUser})
        chat.participants.push({'username':req.body.clientUser})
        chat.save();
        const user1 = await User.findOne({ username: req.body.targetUser }).exec();
        user1.chats.push({ 'chatid': chat._id })
        user1.save();
        const user2 = await User.findOne({ username: req.body.clientUser }).exec();
        user2.chats.push({ 'chatid': chat._id })
        user2.save();
        res.status(200).json({'id': chat._id})
    }catch(err){
        console.log(err.message)
        res.status(500).json({'message': err.message})
    }
}

module.exports = {getChatsFromUser, getChatParticipants, getChatMessages, createChat };