const bcrypt = require('bcryptjs');
const ENV = require('dotenv');
const User = require('../../models/user.model');

ENV.config();

module.exports = async (req, res) => {
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
};
