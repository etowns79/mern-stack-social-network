const User = require('../models/user')

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
        return res.status(500).json({ err })
    }
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