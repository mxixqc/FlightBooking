const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config(); // for environment variables
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
var cors = require('cors') // 1) npm install cors, 2) get the cors object
const port = process.env.PORT || 5001;

connectDB()

const app = express();

// in order to pass body data in json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors()) // 3) use the cors object

app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);


app.listen(port, () => console.log(`Server started on port ${port}`))