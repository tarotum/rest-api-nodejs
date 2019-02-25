const jwt = require('jsonwebtoken');
const ENV = require('dotenv');

ENV.config();

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization.split(' ')[1];
  if (!authorization) {
    res.status(401).json({
      errors: ['You could not be authorized']
    });
  } else {
    try {
      const decodedToken = jwt.verify(authorization, process.env.JWT_SECRET);
      req.userInfo = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({
        errors: ['Auth failed']
      });
    }
  }
};
