const create = require('./createTag');
const getAll = require('./getAllTags');
const getOneById = require('./getOneTagById');
const getOneBySlug = require('./getOneTagBySlug');
const updateById = require('./updateTagById');
const removeById = require('./removeByTagId');

module.exports = {
  create,
  getAll,
  getOneById,
  getOneBySlug,
  updateById,
  removeById
};
