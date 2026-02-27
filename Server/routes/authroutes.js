const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword, googleLogin } = require('../Controller/authcontroller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

router.put('/password', updatePassword);

module.exports = router;
