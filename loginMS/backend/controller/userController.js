const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email | !password) {
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    // if user exists, return his details
    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials. Please ensure you keyed in the correct email and password.')
    }
})

// Generate JSON Web Token
const generateToken = (id) => { // need to specify payload
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '40d', // this function will sign a new token with this id and secret used and it will expire in 40 days
    }) 
}

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, username, email} = await User.findById(req.user.id)

    // if user does /api/users/me with their token they will get their info
    res.status(200).json({
        id: _id,
        username,
        email,
    })
})

module.exports = {
    registerUser,
    loginUser,
    getMe,
}