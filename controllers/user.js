const User = require('../models/user')
const _ = require('lodash');
const expressJwt = require('express-jwt')


exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user
        next()
    } catch (error) {
        return res.status(500).json({ error: "User not found" })
    }
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id

    if (!authorized) return res.status(403).json({ error: "User is not authorized to perform this action" })
    next();
}

exports.allUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email updated created')
        res.json({ users })
    } catch (error) {
        res.status(400).json({ error: error })
    }

}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}

exports.updateUser = async (req, res, next) => {
    try {
        let user = req.profile;
        user = _.extend(user, req.body);
        user.updated = Date.now()
        const savedUser = await user.save();
        savedUser.hashed_password = undefined;
        savedUser.salt = undefined
        res.json({ savedUser })
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        let user = req.profile
        const rm = await user.remove()
        res.json({ message: "User has been deleted" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}



