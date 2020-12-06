const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "notConfirmed" 
    },
    role: {
        type: String,
        default: "User"
    },
    likedMovies: {
        type: Array,
        default: []
    },
    dislikedMovies: {
        type: Array,
        default: []
    }
});

module.exports = model("User", userSchema);