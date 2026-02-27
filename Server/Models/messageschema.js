const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helper: conversation key for two users (sorted so A↔B == B↔A)
messageSchema.statics.conversationKey = function (idA, idB) {
  return [idA.toString(), idB.toString()].sort().join('_');
};

module.exports = mongoose.model('Message', messageSchema);
