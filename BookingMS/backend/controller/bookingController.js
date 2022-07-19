const asyncHandler = require('express-async-handler');

const Booking = require('../model/bookingModel');
const User = require('../model/userModel')

// @desc    Get booking
// @route   GET /api/booking
// @access  Private
const getBooking = asyncHandler(async (req, res) => { // when we use Mongoose to interact with DB, we get a promise
    const booking = await Booking.find({ user: req.user.id })
    res.status(200).json({booking});
})

// @desc    Set booking
// @route   POST /api/booking
// @access  Private
const setBooking = asyncHandler(async (req, res) => {
    // what to do if user never put in html
    if (!req.body.bookingDetails) {
        res.status(400)
        throw new Error('Please enter all traveller details.');
    }

    const booking = await Booking.create({
        bookingDetails: req.body.bookingDetails,
        user: req.user.id
    })

    res.status(200).json(booking);
})

module.exports = {
    getBooking,
    setBooking,
}