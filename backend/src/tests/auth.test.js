const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test MongoDB database
    const mongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/interviewiq_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up DB and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'SecurePassword123!',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toEqual('johndoe@example.com');
  });

  it('should reject registration with an existing email', async () => {
    // Pre-create user
    await User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'SecurePassword123!',
      isVerified: true,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'AnotherPassword123!',
      });

    expect(res.statusCode).toEqual(409); // Conflict
    expect(res.body.status).toEqual('fail');
  });

  it('should log in an existing verified user', async () => {
    // Pre-create user
    await User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'SecurePassword123!',
      isVerified: true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'SecurePassword123!',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toEqual('johndoe@example.com');
  });

  it('should reject login with wrong password', async () => {
    await User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'SecurePassword123!',
      isVerified: true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body.status).toEqual('fail');
  });
});
