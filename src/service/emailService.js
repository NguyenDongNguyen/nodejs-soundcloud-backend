import nodemailer from 'nodemailer';
require('dotenv').config();
// var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ACCOUNT, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Music Cloud 👻" <${process.env.MAIL_ACCOUNT}>`, // sender address
        to: email, // list of receivers
        subject: ` Welcome to become a VIP member`, // Subject line
        text: 'Hello world?', // plain text body
        html: `Thank you for registering to become our VIP member`, // html body
    });
};

module.exports = {
    sendEmailCreateOrder,
};
