const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    likes: [String],
    comments: [{
        user: {type: String, required: true},
        content: {type: String, required: true},
        date:{type: Date, default: Date.now, required: true},
        id: mongoose.ObjectId
    }]
});

module.exports = mongoose.model('Post', postSchema);