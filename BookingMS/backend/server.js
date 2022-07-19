const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config(); // for environment variables
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
var cors = require('cors');
const port = process.env.PORT || 5000;

connectDB()

const app = express();

// in order to pass body data in json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/api/bookings', require('./routes/bookingRoutes')); //http://localhost:5000/api/bookings

app.use(errorHandler);


app.listen(port, () => console.log(`Server started on port ${port}`))