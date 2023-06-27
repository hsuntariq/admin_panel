const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name field'],
        minlength: [3, 'Name should be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email field'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'Please enter the password field'],
        minlength: [6, 'Password should be at least 6 characters long']
    },
    role: {
        type: Number,
        default: 0
    },
    resetToken: {
        default:null,
        type:String,
    },
    resetTokenExpiration:{
        default:null,
        type:Date
    }
});

module.exports = mongoose.model('User', userSchema);
