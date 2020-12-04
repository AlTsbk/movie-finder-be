const {Schema, model} = require("mongoose");

const commentSchema = new Schema({
    movieId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    }
});

module.exports = model("Comment", commentSchema);