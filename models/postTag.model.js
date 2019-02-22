const mongoose = require('mongoose');
const mongooseSlugPlugin = require('mongoose-slug-plugin');
const limax = require('limax');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const postTagSchema = new Schema({
  type: {
    type: String,
    enum: ['graphic', 'sound'],
    required: true
  },
  status: {
    type: String,
    enum: ['publish', 'draft'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  content: String,
  lang: {
    type: String,
    enum: ['en', 'ru', 'ua'],
    required: true
  }
});

postTagSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>', slug: limax });
postTagSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('PostTag', postTagSchema);
