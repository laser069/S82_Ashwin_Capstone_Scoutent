const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../Models/user');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const authcontroller=require('../Controller/authcontroller');

require('dotenv').config();
jest.setTimeout(10000); 

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

it('should register a new user successfully', async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test1234',
    role: 'player'
  });
  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe('User registered successfully');
});

it('should not register if email already exists', async () => {
  await User.create({ name: 'Test', email: 'dup@example.com', password: 'hashedpass', role: 'scout' });
  
  const res = await request(app).post('/api/auth/register').send({
    name: 'Duplicate',
    email: 'dup@example.com',
    password: 'Test1234',
    role: 'player'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Email already exists');
});

it('should login with correct credentials', async () => {
  const password = await bcrypt.hash('Test1234', 10);
  await User.create({ name: 'LoginUser', email: 'login@example.com', password, role: 'player' });

  const res = await request(app).post('/api/auth/login').send({
    email: 'login@example.com',
    password: 'Test1234'
  });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('token');
});

it('should not login with incorrect password', async () => {
  const password = await bcrypt.hash('correctpass', 10);
  await User.create({ name: 'WrongPass', email: 'wrong@example.com', password, role: 'player' });

  const res = await request(app).post('/api/auth/login').send({
    email: 'wrong@example.com',
    password: 'wrongpass'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Invalid credentials');
});

it('should not update password if current password is wrong', async () => {
  const password = await bcrypt.hash('oldpass', 10);
  const user = await User.create({ name: 'UpdatePass', email: 'pass@example.com', password, role: 'player' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const res = await request(app)
    .put('/api/auth/password')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: user._id,  
      currentPassword: 'wrongpass',
      newPassword: 'newpass123'
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Current password is incorrect');
});