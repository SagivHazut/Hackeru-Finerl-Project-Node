const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sagivhazut@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

function getMailOptions(to) {
  return {
    from: "sagivhazut@gmail.com",
    to: to,
    subject: "MyApp - Reset password",
    html: getPassResetLink(to),
  };
}

function getPassResetLink(to) {
  return `<a href='http://localhost:3000/resetpassword?email=${to}'>Rest password</a>`;
}

router.get("/resetPassword", (req, res) => {
  let { email } = req.query;
  let options = getMailOptions(email);
  transporter.sendMail(options, (err, info) => {
    if (err) {
      res.statusCode = 500;
      res.json({ err });
    } else {
      res.statusCode = 200;
      res.json(info);
    }
  });
});

router.post("/", (req, res) => {
  let { email, newPass } = req.query;
  createHash(newPass).then((hashedPass) => {
    updateUserPassword(email, hashedPass)
      .then((updateRes) => {
        res.statusCode = 200;
        res.json({ msg: updateRes });
      })
      .catch((e) => {
        res.statusCode = 500;
        console.log(e);
        res.json({ msg: "Error" });
      });
  });
});
module.exports = router;
