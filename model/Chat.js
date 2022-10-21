const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name: String,
    participants: [{username: String}],
    messages:[{
        author: {type: String},
        content: {type: String},
        date: {type:Date, default: Date.now()}
    }]
});

module.exports = mongoose.model('Chat', chatSchema);