const { Router } = require("express");
const router = Router();
const Movie = require("../models/Movie");
const User = require("../models/User");

router.get("/:movieId", async (req, res) => {
    try {
        let movie = await Movie.findOne({
            movieId: req.params.movieId
        });
        
        return res.status(200).json(movie);
        
    } catch (error) {
        res.status(500).json("error");
    }
});

router.put("/rate", async (req, res)=>{
    try {
        const {movieId, userId, note} = req.body;

        const user = await User.findById(userId);
        const movie = await Movie.findOne({movieId}) || new Movie({movieId});

        if(note){
            movie.positiveNotes.push(userId);
            user.likedMovies.push(movieId);
        }else{
            movie.negativeNotes.push(userId);
            user.dislikedMovies.push(movieId);
        }

        movie.save();
        user.save();

        res.status(200).json({
            message: "movie was rated" 
        });
        
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;

