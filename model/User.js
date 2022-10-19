const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    fullname: {
        type: String
    },
    following: [{
        username: String
    }],
    followers: [{
        username: String
    }],
    chats : [{
        chatid: Schema.Types.ObjectId
    }],
    chatsGrupales : [{
        type: Schema.Types.ObjectId //Esta feature aún no está incluida
    }]
});

module.exports = mongoose.model('User', userSchema);