const AsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const bcrypt = require('bcrypt')
const resetPassword = AsyncHandler(async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            res.status(400);
            throw new Error('Email field is required');
        }

        const checkUser = await User.findOne({
            email
        });
        if (!checkUser) {
            res.status(404);
            throw new Error('Invalid Email Address!');
        }
        // update the token information
        const resetToken = checkUser.id;
        checkUser.resetToken = resetToken;
        checkUser.resetTokenExpiration = new Date(Date.now() + 3600000);
        await checkUser.save();

        // create the mail trasnporter

        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hsuntariq@gmail.com',
                pass: 'ucsmkaqrstopatxs',
            },
        });

        // create the credentials for the transporter

        const mailOptions = {
            from: 'hsuntariq@gmail.com',
            to: checkUser.email,
            subject: 'Test Email',
            text: `Please click the following link to reset your password: http://localhost:3001/api/reset-password/${resetToken}`,
        };

            // Send email using the transporter
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error.message);
            } else {
                res.json({
                    checkUser,
                    email: 'Email Sent Successfully',
                    messageID: info.messageId
                })
            }
        });
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});

const newPassword = async (req, res) => {
    const resetToken = req.params.token;
    const {
        password
    } = req.body;

    try {
        const user = await User.findOne({
            resetToken,
            
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found or token expired');
        }

        if (!password) {
            res.status(400);
            throw new Error('Password field is required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.json({
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};

module.exports = {
    resetPassword,
    newPassword,
};






module.exports = {
    resetPassword,
    newPassword
};