"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

///* to be used as
/*
await sendMail({
  from: "support@expedite.com",
  to: email,
  subject: "Verification mail",
  text: "url here",
  html: "<ul><li>api for verication left</li></ul>",
}).catch((error)=>{
  
});

*/
// async..await is not allowed in global scope, must use a wrapper
const sendMail = async ({ from, to, subject, text, html }) => {
  //   const { from, to, subject, text, html } = params;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    "Encryption method": "STARTTLS",
    auth: {
      user: process.env.MAIL_ID, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
