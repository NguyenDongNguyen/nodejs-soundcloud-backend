import nodemailer from 'nodemailer';
require('dotenv').config();
// var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateUserVip = async (email) => {
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
        // html: `Thank you for registering to become our VIP member`, // html body
        html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                <meta charset="UTF-8">
                <title>CodePen - OTP Email Template</title>
                

                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Music Cloud</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Thank you for registering to become our VIP member</p>
                    <p style="font-size:0.9em;">Regards,<br />Music Cloud</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Music Cloud Inc</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                    </div>
                </div>
                </div>
                <!-- partial -->
                
                </body>
                </html>`,
    });
};

const sendEmailForgotPassword = async (email, link) => {
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
        subject: ` Forgot Password`, // Subject line
        text: 'Hello world?', // plain text body
        // html: `Thank you for registering to become our VIP member`, // html body
        html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                <meta charset="UTF-8">
                <title>CodePen - OTP Email Template</title>
                

                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Music Cloud</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Please click on the link below to change your password, this link will expire 5 minutes from now.</p>
                    <h2>${link}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Music Cloud</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Music Cloud Inc</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                    </div>
                </div>
                </div>
                <!-- partial -->
                
                </body>
                </html>`,
    });
};

module.exports = {
    sendEmailCreateUserVip,
    sendEmailForgotPassword,
};
