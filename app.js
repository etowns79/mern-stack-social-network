const express = require('express');
const app = express();
const bodyParser = require('body-parser')
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

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use('/api/posts', postRoutes);

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`API is listening on port ${port}`));
