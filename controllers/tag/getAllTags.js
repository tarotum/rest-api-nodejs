const Tag = require('../../models/postTag.model');

module.exports = async (req, res) => {
  const query = {};
  if (req.query.lang !== undefined) {
    query.lang = req.query.lang;
  }
  if (req.query.type !== undefined) {
    query.type = req.query.type;
  }
  if (req.query.status !== undefined) {
    query.status = req.query.status;
  }
  if (req.query.tags !== undefined) {
    const tagsArr = req.query.tags.split(',');
    query.tags = { $in: tagsArr };
  }
  const options = {
    select: '_id title content image slug',
    sort: { date: -1 },
    limit: parseInt(req.query.limit, 10) || 5,
    page: parseInt(req.query.page, 10) || 1
  };
  try {
    const result = await Tag.paginate(query, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
