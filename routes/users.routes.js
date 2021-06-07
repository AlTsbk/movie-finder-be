const {
    Router
} = require("express");
const router = Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        let users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

router.get("/:userId", async (req, res) => {
    try {
        let user = await User.findById(req.params.userId);
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
            message: "Пользователь удален"
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
            message: "Роль изменена"
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
                message: "Пользователь заблокирован"
            });
        }else{
            res.status(200).json({
                message: "Пользователь разблокирован"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;