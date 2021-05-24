const nodemailer = require("nodemailer");
const config = require("config")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("mailBotEmail"),
        pass: config.get("mailBotPassword")
    }
});

const sendConfirmMail = async (userMail, link) => { 
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA",config.get("mailBotEmail"), config.get("mailBotPassword"));
    await transporter.sendMail({
        from: "'MovieFinderbot'",
        to: userMail,
        subject: "email confirmation",
        html: `Please, follow to the <a href="${link}">link</a> to confirm your email address`
    })
}

module.exports = {sendConfirmMail};