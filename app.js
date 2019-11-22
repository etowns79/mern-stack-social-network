const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { check, validationResult } = require('express-validator')
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

//db
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Db connected")
    } catch (error) {
        console.log(error.message)
    }
}

connection()

// routes
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "Unauthorized" });
    }
});

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`API is listening on port ${port}`));
