const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully' });
    console.log(user)
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {

  const { id, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token, role } = req.body;
  console.log("-----------------------------------------");
  console.log("GOOGLE LOGIN ATTEMPT");
  console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("Token received:", token ? "YES" : "NO");
  console.log("Role:", role);

  if (!token) {
    console.log("ERROR: Token is missing");
    return res.status(400).json({ message: 'Token is missing' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        role: role || 'player', // Default role or user selected role
      });
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: jwtToken, user: { id: user._id, email: user.email, role: user.role, name: user.name, picture: user.profilePicture } });
  } catch (err) {
    console.error("Google Login Error:", err);
    console.error("Google Login Error Message:", err.message);
    res.status(400).json({ message: 'Google login failed', error: err.message, details: err });
  }
};
