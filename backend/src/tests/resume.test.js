const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Resume Upload & File Filter Validation', () => {
  let token;

  beforeAll(async () => {
    const mongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/interviewiq_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create a default user and log them in
    await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'SecurePassword123!',
      isVerified: true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'SecurePassword123!',
      });
    token = res.body.data.accessToken;
  });

  it('should reject non-permitted file extensions (e.g., png)', async () => {
    const res = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('fake image content'), 'image.png');

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('Only PDF, DOCX, and TXT files are allowed');
  });

  it('should accept valid plain text file uploads', async () => {
    const res = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('My resume content with skills: React, Node, Express, MongoDB.'), 'resume.txt');

    // Expected output could be 201 (since mock AI is active in test environment, it succeeds)
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.fileName).toEqual('resume.txt');
  });
});
