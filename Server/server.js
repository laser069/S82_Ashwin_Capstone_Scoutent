const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const Message = require('./Models/messageschema');

// ── HTTP Server ──
const httpServer = http.createServer(app);

// ── Socket.IO ──
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Each user joins a room named after their own userId
    // so messages can be targeted directly
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // send_message: { senderId, receiverId, content }
    socket.on('send_message', async (data) => {
        const { senderId, receiverId, content } = data;
        try {
            const message = await Message.create({ senderId, receiverId, content });

            // Emit to receiver's room
            io.to(receiverId).emit('receive_message', message);

            // Ack back to sender so their own UI updates with DB _id + timestamp
            socket.emit('message_sent', message);
        } catch (err) {
            console.error('send_message error:', err);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    // Typing indicators
    socket.on('typing', ({ senderId, receiverId }) => {
        io.to(receiverId).emit('user_typing', { senderId });
    });

    socket.on('stop_typing', ({ senderId, receiverId }) => {
        io.to(receiverId).emit('user_stop_typing', { senderId });
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

// ── MongoDB + Start ──
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
httpServer.setTimeout(300000);
