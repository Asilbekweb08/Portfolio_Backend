const nodemailer = require("nodemailer");
require('dotenv').config()
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Gmail manzilingiz
    pass: process.env.EMAIL_PASS, // App password (Gmail security orqali olinadi)
  },
});

module.exports =transporter


const sendEmail = async (to, subject, text) => {
    console.log(process.env.EMAIL);
    
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
