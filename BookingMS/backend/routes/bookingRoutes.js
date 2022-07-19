const express = require('express');
const router = express.Router();
const { getBooking, setBooking, updateBooking, deleteBooking } = require('../controller/bookingController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getBooking).post(protect, setBooking);
router.route('/:id').put(protect, updateBooking).delete(protect, deleteBooking);

// export router to use in server.js
module.exports = router