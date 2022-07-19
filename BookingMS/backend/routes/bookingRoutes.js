const express = require('express');
const router = express.Router();
const { getBooking, setBooking } = require('../controller/bookingController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getBooking).post(protect, setBooking);

// export router to use in server.js
module.exports = router