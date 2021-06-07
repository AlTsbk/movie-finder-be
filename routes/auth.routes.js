const {Router} = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const mail = require("../components/mail");
const {check, validationResult} = require("express-validator");
const router = Router();
const User = require("../models/User");

router.post("/register",
    [
        check("email", "Не корректный Email").isEmail(),
        check("password", "Не корректный пароль").isLength({
            min: 6
        }),
        check("name", "Не корректное имя").isLength({
            min: 1
        }),
        check("surname", "Не корректная фамилия").isLength({
            min: 1
        })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Данные не валидны"
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
                    message: 'Пользователь с таким email уже существует'
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
                message: "Пользователь был успешно создан"
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });


router.post("/login",
    [
        check("email", "Не корректный Email").isEmail(),
        check("password", "Не корректный пароль").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "данные не валидны"
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
                    message: "Пользователь с такой почтой не существует"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Не верный пароль"
                });
            }
            
            if(user.status === "notConfirmed"){
                return res.status(400).json({
                    message: "Эта почта не подтверждена"
                });
            }

            if(user.status === "baned"){
                return res.status(400).json({
                    message: "Этот пользователь заблокирован"
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

    user.status = "active";

    await user.save();

    res.redirect("http://localhost:3000/login")
});

module.exports = router;