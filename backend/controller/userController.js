const AsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const User = require('../models/userModel')
const registerUser = AsyncHandler(async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (!name && !email && !password) {
        res.status(400)
        throw new Error('Plese enter all the fields')
    }
    // check if user already exists
    const checkUser = await User.findOne({
        email
    });
    if (checkUser) {
        res.status(400);
        throw new Error('user already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registerdUser = await User.create({
        name,
        email,
        password: hashedPassword
    })
    res.status(200).json({
        id: registerdUser._id,
        name: registerdUser.name,
        email: registerdUser.email,
        role:registerdUser.role,
        token: generateToken(registerdUser._id)
    })
})

const loginUser = AsyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email && !password) {
        res.status(400);
        throw new Error('Please fill out all the fields');
    }
    // find the user
    const checkUser = await User.findOne({
        email
    });
    if (!checkUser) {
        res.status(404);
        throw new Error('No User Found');
    }
    if (email && (await bcrypt.compare(password, checkUser.password))) {
        res.status(200).json({
            id: checkUser._id,
            name: checkUser.name,
            email: checkUser.email,
            role:checkUser.role,
            token: generateToken(checkUser._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid Credentials');
        
    }
})

const getUser = (req, res) => {
    const user = req.user
    res.send(user)

}

const getAdmins =AsyncHandler(async(req, res) => {
    const user = req.user;
    if(user.role === 1){
        const admins = await User.find();
        res.status(200).json({
            admins
        })
    } else {
        res.status(401);
        throw new Error('Not Authorized')
    }
})

const generateToken = (id) => {
    return jwt.sign({
        id
    }, jwtSecret, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getAdmins
}