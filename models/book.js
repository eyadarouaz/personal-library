const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String
    },
    comments: [{
        type: String
    }],
    commentCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('BookModel', bookSchema);