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

// @desc    Update booking
// @route   PUT /api/booking/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the log in user matches the booking user
    if (booking.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorised')
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // create if doesnt exist
    })
    res.status(200).json(updatedBooking);
})

// @desc    Delete booking
// @route   DELETE /api/booking/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the log in user matches the booking user
    if (booking.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorised')
    }

    await booking.remove()

    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getBooking,
    setBooking,
    updateBooking,
    deleteBooking
}