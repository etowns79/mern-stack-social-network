const User = require('../models/user');
const { check, validationResult } = require('express-validator')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')


exports.signUp = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) return res.status(403).json({ error: "Email is already taken" })
        const user = await new User(req.body)
        await user.save();
        res.json({ message: "Signup Successful!" })
    } catch (error) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array()[0].msg })
    }

}

exports.signin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: "Credentials are incorrect" })
        if (!user.authenticate(password)) return res.status(401).json({ error: "Invalid email and/or password" })

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("t", token, { expire: new Date() + 9999 })
        const { _id, name } = user
        const user_email = user.email;
        return res.json({ token, user: { _id, name, user_email } })
    } catch (error) {
        res.status(500).send(error.message)
    }

}

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({ message: "You are signed out" })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if (!authorized) return res.status(403).json({ error: "User is not authorized to perform this action" })
}