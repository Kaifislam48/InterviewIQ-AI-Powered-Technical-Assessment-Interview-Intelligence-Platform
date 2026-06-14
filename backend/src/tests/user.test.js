const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('User Endpoints & Profile Validation', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewiq_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create a default user and log them in to get an access token
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'SecurePassword123!',
      isVerified: true,
    });
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'SecurePassword123!',
      });
    token = res.body.data.accessToken;
  });

  it('should update profile successfully with valid data', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        email: 'newemail@example.com',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.name).toEqual('New Name');
    expect(res.body.data.email).toEqual('newemail@example.com');
  });

  it('should reject profile update with invalid email format', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'notanemail',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('Validation failed');
  });

  it('should reject profile update with name that is too short', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'a',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.status).toEqual('fail');
  });

  it('should reject profile update with password that is too short', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: '123',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.status).toEqual('fail');
  });
});
