const mongoose = require('mongoose');
const connectDB = async() => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`database connected on host:${mongoose.connection.host.green}`);
}

module.exports = connectDB