const fs = require('fs');
const path = require('path');
const Post = require('../../models/post.model');

module.exports = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      res.status(404).json('Post not found.');
    } else {
      if (post.image !== undefined) {
        fs.unlinkSync(path.resolve(__dirname, `../${post.image}`));
      }
      await Post.deleteOne({ _id: req.params.id });
      res.status(200).json('Deleted.');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
