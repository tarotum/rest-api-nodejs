const create = require('./createPost');
const updateById = require('./updatePostById');
const getById = require('./getPostById');
const getBySlug = require('./getPostBySlug');
const getAll = require('./getAllPosts');
const removeById = require('./removePostById');

module.exports = {
  create,
  updateById,
  getById,
  getBySlug,
  getAll,
  removeById
};
