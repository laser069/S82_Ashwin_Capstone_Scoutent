const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return !this.googleId; } },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  role: { type: String, enum: ['player', 'scout'], required: true, default: 'player' },
  bio: { type: String },
  sport: { type: String, enum: ['football', 'cricket'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
