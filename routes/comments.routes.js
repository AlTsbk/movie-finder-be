const {
    Router
} = require("express");
const router = Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
const {
    check,
    validationResult
} = require("express-validator");

router.get("/:movieId", async (req, res) => {

        try {
            let comments = await Comment.find({
                movieId: req.params.movieId
            });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });

router.post("/",
    [
        check("text", "comment is empty").isLength({
            min: 1
        }),
        check("userId", "userId is empty").isLength({
            min: 1
        }),
        check("movieId", "movieId is empty").isLength({
            min: 1
        })
    ], async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "data is not valid"
            });
        }

        const {
            movieId,
            userId,
            text
        } = req.body;

        let user = await User.findById(userId);
        const userName = user.name + " " + user.surname;
        const today = new Date();
        const date = formatDate(today.getFullYear())+'-'+formatDate(today.getMonth()+1)+'-'+formatDate(today.getDate());
        var time = formatDate(today.getHours()) + ":" + formatDate(today.getMinutes()) + ":" + formatDate(today.getSeconds());
        const comment = new Comment({
            movieId,
            userId,
            userName,
            text,
            date,
            time
        });

        await comment.save();

        res.status(201).json({
            message: "Comment has been added"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

const formatDate = num => {
    return num.toString().length > 1 ? num : "0" + num;
}

module.exports = router;