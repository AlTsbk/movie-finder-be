const {
    Router
} = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const mail = require("../components/mail");
const {
    check,
    validationResult
} = require("express-validator");
const router = Router();
const User = require("../models/User");

router.post("/register",
    [
        check("email", "Email is incorrect").isEmail(),
        check("password", "password is incorrect").isLength({
            min: 6
        }),
        check("name", "name is incorrect").isLength({
            min: 1
        }),
        check("surname", "surname is incorrect").isLength({
            min: 1
        })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "data is not valid"
                });
            }

            const {
                email,
                password,
                name,
                surname
            } = req.body;

            const candidate = await User.findOne({
                email
            });

            if (candidate) {
                return res.status(400).json({
                    message: 'user with this email has already been created'
                })
            }

            const hasOfPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                password: hasOfPassword,
                name,
                surname
            });

            await user.save();

            mail.sendConfirmMail(user.email, `http://localhost:5000/api/auth/confirm/${user._id}/`);

            res.status(201).json({
                message: "User has been created"
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });


router.post("/login",
    [
        check("email", "Email is incorrect").isEmail(),
        check("password", "password is incorrect").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "data is not valid"
                });
            }

            const {
                email,
                password
            } = req.body;

            const user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(400).json({
                    message: "User with this email does not exist"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Wrong password"
                });
            }
            
            if(!user.isActive){
                return res.status(400).json({
                    message: "This email address is not verified"
                });
            }

            const token = jwt.sign({
                    userId: user.id
                },
                config.get("jwtSecret"), {
                    expiresIn: "1h"
                });

            res.json({
                token,
                userId: user.id
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });


router.get("/confirm/:userId", async (req, res) => {
    const user = await User.findOne({
        _id: req.params.userId
    });

    user.isActive = true;

    await user.save();

    res.redirect("http://localhost:3000/login")
});

module.exports = router;