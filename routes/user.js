const express = require('express');
const router = express.Router()

const { userById, allUsers, getUser, updateUser, requireSignin, hasAuthorization, deleteUser } = require('../controllers/user');


router.get('/', allUsers);

router.get('/:userId', requireSignin, getUser)
router.put('/edit/:userId', requireSignin, hasAuthorization, updateUser)
router.delete("/:userId", requireSignin, hasAuthorization, deleteUser);

router.param('userId', userById)


module.exports = router;