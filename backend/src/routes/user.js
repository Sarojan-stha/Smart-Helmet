const express = require('express')
const User = require('../model/user')
const router = express.Router();

const {createUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/user')

router.post('/createUser', createUser);

router.get('/allUsers', getAllUsers);

router.patch('/updateUser',updateUser);

router.delete('/deleteUser',deleteUser);

module.exports = router;