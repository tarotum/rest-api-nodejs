const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ENV = require('dotenv');
const User = require('../models/user.model');

ENV.config();

module.exports = {
  signup: async (req, res) => {
    try {
      // Find user with the same email
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        res.status(409).json('User already exist.');
      } else {
        // if user not found hash password and create new user
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: passwordHash
        });
        await user.save();

        res.status(201).json('User created');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  signin: async (req, res) => {
    if (!req.body.email) {
      res.status(400).json('Email required.');
    } else if (!req.body.password) {
      res.status(400).json('Password required.');
    } else {
      try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const checkPassword = await bcrypt.compare(req.body.password, user.password);
          if (checkPassword) {
            const token = await jwt.sign(
              { name: user.name, email: user.email },
              process.env.JWT_SECRET,
              {
                expiresIn: '1h'
              }
            );
            res
              .status(200)
              .header('x-auth-token', token)
              .json(token);
          } else {
            res.status(401).json('Invalid username or password');
          }
        } else {
          res.status(401).json('Invalid username or password');
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }
};
