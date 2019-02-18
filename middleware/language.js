module.exports = (req, res, next) => {
  switch (req.params.lang) {
    case 'ru':
      req.lang = 'ru';
      break;
    case 'ua':
      req.lang = 'ua';
      break;
    default:
      req.lang = 'en';
      break;
  }
  next();
};
