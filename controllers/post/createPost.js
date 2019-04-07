const Post = require('../../models/post.model');

module.exports = async (req, res) => {
  const { type, status, title, content, lang, tags } = req.body;

  // Creating post if all if required fields are exist
  const newPost = new Post({
    type,
    status: status || 'draft',
    title,
    content,
    lang: lang || 'en'
  });

  if (tags) {
    // Splitting req string tags into array with tag ids
    // string must contain tags id divided by comma
    newPost.tags = tags.split(',');
  }

  if (req.file) {
    // Replacing divider in image path
    newPost.image = req.file.path.replace(/\\/g, '/');
  }
  try {
    const result = await newPost.save();

    // Return crated post if save succesfull
    // returning only useful info without mongodb services fields
    res.status(201).json(result._doc);
  } catch (error) {
    res.status(500).json(error);
  }
};
