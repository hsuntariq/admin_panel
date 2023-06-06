const express = require('express');
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/connect.js')
require('dotenv').config();
require('colors');
const port = process.env.PORT;
const app = express();


// connect to the database
connectDB()
// get the data from the body
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// handle user routes
app.use('/api/users',require('./routes/userRoutes'))
// check for errors
app.use(errorHandler)




app.listen(port,()=>console.log(`server started on port:${port.cyan}`))

