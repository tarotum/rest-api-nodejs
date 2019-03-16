const jwt = require('jsonwebtoken');
const ENV = require('dotenv');

ENV.config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json('You could not be authorized');
  } else {
    try {
      const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
      req.userInfo = decodedToken;
      next();
    } catch (error) {
      res.status(401).json('Auth failed');
    }
  }
};
