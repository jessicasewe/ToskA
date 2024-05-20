const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { registerUser, loginUser } = require('../controllers/authController');
const app = require('../server'); // Assuming your express app is exported from server.js

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

describe('Auth Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Test for registerUser
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      sandbox.stub(User, 'findOne').resolves(null);
      sandbox.stub(User.prototype, 'save').resolves();
      sandbox.stub(bcrypt, 'genSalt').resolves('salt');
      sandbox.stub(bcrypt, 'hash').resolves('hashedPassword');
      sandbox.stub(jwt, 'sign').callsFake((payload, secret, options, callback) => {
        callback(null, 'fakeToken');
      });

      await registerUser(req, res);

      expect(User.findOne).to.have.been.calledWith({ email: 'test@example.com' });
      expect(bcrypt.genSalt).to.have.been.calledWith(10);
      expect(bcrypt.hash).to.have.been.calledWith('password123', 'salt');
      expect(User.prototype.save).to.have.been.calledOnce;
      expect(jwt.sign).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ token: 'fakeToken' });
    });

    it('should return 400 if user already exists', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      sandbox.stub(User, 'findOne').resolves({ id: 'existingUserId' });

      await registerUser(req, res);

      expect(User.findOne).to.have.been.calledWith({ email: 'test@example.com' });
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ message: 'User already exists' });
    });

    it('should return 500 on server error', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      sandbox.stub(User, 'findOne').throws(new Error('Server error'));

      await registerUser(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({ message: 'Server error' });
    });
  });

  // Test for loginUser
  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const mockUser = {
        id: 'userId',
        password: 'hashedPassword',
      };

      sandbox.stub(User, 'findOne').resolves(mockUser);
      sandbox.stub(bcrypt, 'compare').resolves(true);
      sandbox.stub(jwt, 'sign').callsFake((payload, secret, options, callback) => {
        callback(null, 'fakeToken');
      });

      await loginUser(req, res);

      expect(User.findOne).to.have.been.calledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).to.have.been.calledWith('password123', 'hashedPassword');
      expect(jwt.sign).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ token: 'fakeToken' });
    });

    it('should return 400 if invalid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongPassword',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      sandbox.stub(User, 'findOne').resolves(null);

      await loginUser(req, res);

      expect(User.findOne).to.have.been.calledWith({ email: 'test@example.com' });
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ message: 'Invalid credentials' });
    });

    it('should return 500 on server error', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      sandbox.stub(User, 'findOne').throws(new Error('Server error'));

      await loginUser(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({ message: 'Server error' });
    });
  });
});

after(() => {
  mongoose.connection.close();
});
