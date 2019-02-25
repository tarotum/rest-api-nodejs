const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ENV = require('dotenv');
const User = require('../models/user.model');

ENV.config();

module.exports = {
  signup: async (req, res) => {
    try {
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        res.status(409).json({ errors: ['User already exist.'] });
      } else {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: passwordHash
        });

        const savedUser = await user.save();

        res.status(201).json({ result: `Created ${savedUser.name} user`, errors: [] });
      }
    } catch (error) {
      res.status(500).json({ errors: [error] });
    }
  },
  signin: async (req, res) => {
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
            .header('x-auth', token)
            .json({ result: `Welcome ${user.name}`, token, errors: [] });
        } else {
          res.status(401).json({ errors: ['Invalid username or password'] });
        }
      } else {
        res.status(401).json({ errors: ['Invalid username or password'] });
      }
    } catch (error) {
      res.status(500).json({ errors: [error] });
    }
  }
};
