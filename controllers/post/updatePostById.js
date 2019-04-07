const Post = require('../../models/post.model');

module.exports = async (req, res) => {
  const { type, status, title, lang, content, tags } = req.body;

  try {
    const post = await Post.findById({ _id: req.params.id });

    if (!post) return res.status(404).json('Post not found.');

    post.type = type || post.type;
    post.status = status || post.status;
    post.title = title || post.title;
    post.lang = lang || post.lang;
    post.content = content || post.content;

    if (tags) {
      post.tags = tags.split(',');
    } else if (tags === '' && post.tags !== undefined) {
      post.tags = undefined;
    }

    if (req.file) {
      post.image = req.file.path.replace(/\\/g, '/');
    } else if (!req.file && post.image !== undefined) {
      post.image = undefined;
    }
    await post.save();
    /* eslint-disable no-underscore-dangle */
    res.status(200).json(post._doc);
  } catch (error) {
    res.status(500).json(error);
  }
};
