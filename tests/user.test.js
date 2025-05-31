const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../src/models/User');

// Set test environment variables
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/user_management_test';

// Create a test app instance without starting the server
const app = require('../src/app');
let server;

beforeAll(async () => {
  // Close any existing connections
  await mongoose.connection.close();
  
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI_TEST);
  
  // Start server on a different port for testing
  server = app.listen(3001);
});

afterAll(async () => {
  // Close server and database connection
  await server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User API', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    adminToken = admin.generateToken();

    // Create regular user
    const user = await User.create({
      email: 'user@test.com',
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user'
    });
    userToken = user.generateToken();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'newuser@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('email', 'newuser@test.com');
    });

    it('should not create user with existing email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'user@test.com',
          password: 'password123',
          firstName: 'Duplicate',
          lastName: 'User'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user profile when authenticated', async () => {
      const user = await User.findOne({ email: 'user@test.com' });
      
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'user@test.com');
    });

    it('should not get user profile when not authenticated', async () => {
      const user = await User.findOne({ email: 'user@test.com' });
      
      const response = await request(app)
        .get(`/api/users/${user._id}`);

      expect(response.status).toBe(401);
    });
  });
}); 