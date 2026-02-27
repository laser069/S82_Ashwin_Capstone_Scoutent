const Message = require('../Models/messageschema');
const User = require('../Models/user');
const mongoose = require('mongoose');

// GET /api/chat/conversations
exports.getConversations = async (req, res) => {
    try {
        // JWT stores { id: ... } (not _id)
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .sort({ createdAt: -1 })
            .populate('senderId', 'name role')
            .populate('receiverId', 'name role');

        const convMap = {};
        for (const msg of messages) {
            const senderIdStr = msg.senderId?._id?.toString() ?? msg.senderId?.toString();
            const other = senderIdStr === userId.toString() ? msg.receiverId : msg.senderId;
            if (!other || !other._id) continue;
            const otherId = other._id.toString();

            if (!convMap[otherId]) {
                const unread = await Message.countDocuments({
                    senderId: other._id,
                    receiverId: userId,
                    read: false,
                });
                convMap[otherId] = {
                    userId: otherId,
                    name: other.name,
                    role: other.role,
                    avatar: other.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt,
                    unread,
                };
            }
        }

        res.json(Object.values(convMap));
    } catch (err) {
        console.error('getConversations error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/chat/messages/:userId
exports.getMessages = async (req, res) => {
    try {
        const myId = req.user.id;
        const otherId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(otherId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherId },
                { senderId: otherId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        const otherUser = await User.findById(otherId).select('name role');

        res.json({ messages, otherUser });
    } catch (err) {
        console.error('getMessages error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/chat/mark-read/:userId
exports.markRead = async (req, res) => {
    try {
        const myId = req.user.id;
        const otherId = req.params.userId;

        await Message.updateMany(
            { senderId: otherId, receiverId: myId, read: false },
            { $set: { read: true } }
        );

        res.json({ ok: true });
    } catch (err) {
        console.error('markRead error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/chat/users
exports.getAllUsers = async (req, res) => {
    try {
        const myId = req.user.id;
        const users = await User.find({ _id: { $ne: myId } }).select('name role');
        res.json(users);
    } catch (err) {
        console.error('getAllUsers error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
