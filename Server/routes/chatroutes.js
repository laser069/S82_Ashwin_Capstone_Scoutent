const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authMiddleware');
const {
    getConversations,
    getMessages,
    markRead,
    getAllUsers,
} = require('../Controller/chatcontroller');

router.get('/conversations', auth, getConversations);
router.get('/messages/:userId', auth, getMessages);
router.post('/mark-read/:userId', auth, markRead);
router.get('/users', auth, getAllUsers);

module.exports = router;
