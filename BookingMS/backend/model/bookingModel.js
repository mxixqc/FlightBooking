const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // which to know which model does this ObjectID pertain to -- User
    },
    bookingDetails: {
        type: Object,
        passenger: {
            type: Object,
            fname: {
                type: String
            },
            lname: {
                type: String,
            },
            dob: {
                type: String,
            },
        },
        payer: {
            type: Object,
            salutation: {
                type: String,
            },
            fname: {
                type: String,
            },
            lname: {
                type: String,
            },
            email: {
                type: String,
            }
        },
        flightDetails: {
            type: Object,
            airlineID: {
                type: String,
            },
            destAP: {
                type: String,
            },
            sourceAP: {
                type: String,
            },
            flightDate: {
                type: String,
            },
            totalPrice: {
                type: String,
            }
        }
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema);