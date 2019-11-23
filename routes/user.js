const express = require('express');
const router = express.Router()

const { userById, allUsers, getUser } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth')

router.get('/', allUsers);

router.get('/:userId', requireSignin, getUser)

router.param('userId', userById)

module.exports = router;