const express = require('express');
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/connect.js')
require('dotenv').config();
require('colors');
const cors = require('cors')
const port = process.env.PORT;
const app = express();

// allow cross site requests
app.use(cors());
// connect to the database

connectDB()
// get the data from the body
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// handle user routes
app.use('/api/users',require('./routes/userRoutes'))
// handle reset password
app.use('/api/users/reset-password', require('./routes/resetPasswordRoute'))
// check for errors
app.use(errorHandler)




app.listen(port,()=>console.log(`server started on port:${port.cyan}`))

