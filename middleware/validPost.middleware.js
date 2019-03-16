// Checking if required fields are exist
module.exports = (req, res, next) => {
  if (!req.body.type) {
    res.status(400).json('Post type required.');
  } else if (!req.body.status) {
    res.status(400).json('Post status required.');
  } else if (!req.body.title) {
    res.status(400).json('Post title required.');
  } else if (!req.body.lang) {
    res.status(400).json('Post lang required.');
  } else {
    next();
  }
};
