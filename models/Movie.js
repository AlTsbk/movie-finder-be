const {Schema, model} = require("mongoose");

const movieSchema = new Schema({
    movieId: {
        type: String,
        required: true,
        unique: true,
    },
    positiveNotes: {
        type: Array,
        required: true,
        default: []
    },
    negativeNotes: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = model("Movie", movieSchema);