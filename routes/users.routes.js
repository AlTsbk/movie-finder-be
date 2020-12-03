const {
    Router
} = require("express");
const router = Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        var users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

router.get("/:userId", async (req, res) => {
    try {
        var user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/:userId", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({
            message: "User has been deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/changeRole", async (req, res) => {
    try {

        await User.findByIdAndUpdate(req.body.userId, {
            role: req.body.role
        });
        res.status(200).json({
            message: "Role has been changed"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/ban", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {
            status: req.body.status
        });

        if(req.body.status === "banned"){
            res.status(200).json({
                message: "User has been banned"
            });
        }else{
            res.status(200).json({
                message: "User has been unbanned"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;