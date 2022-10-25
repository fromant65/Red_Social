const express = require('express');
const router = express.Router();
const path = require('path');
const chatController = require('../controllers/chatController')

router.get('/get-chats-from-user/:username', chatController.getChatsFromUser)
router.get('/get-chat-participants/:id', chatController.getChatParticipants)
router.get('/get-chat-messages/:id', chatController.getChatMessages)
router.get('/get-chat-by-id/:id', chatController.getChatById);
router.post('/create-chat', chatController.createChat)
router.post('/send-message', chatController.sendMessage)

module.exports = router;