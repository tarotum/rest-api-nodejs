const Post = require('../../models/post.model');

module.exports = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).json('Post not found! :c');
    } else {
      /* eslint-disable no-underscore-dangle */
      res.status(200).json(post._doc);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
