const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ENV = require('dotenv');
const User = require('../models/user.model');

ENV.config();

module.exports = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    if (password.length < 10) {
      return res.status(409).json('Password must be 10 characters or more.');
    }

    try {
      // Find user with the same email
      const userExist = await User.findOne({ email });
      if (userExist) {
        res.status(409).json('User already exist.');
      } else {
        // if user not found hash password and create new user
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
          name,
          email,
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
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json('Email required.');
    } else if (!password) {
      res.status(400).json('Password required.');
    } else {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const checkPassword = await bcrypt.compare(password, user.password);
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
              .json('Successful');
          } else {
            res.status(401).json('Invalid email or password');
          }
        } else {
          res.status(401).json('Invalid email or password');
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }
};
