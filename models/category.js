const mongoose = require('mongoose');
const mongooseSlugPlugin = require('mongoose-slug-plugin');
const limax = require('limax');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    type: {
      type: String,
      enum: ['graphic-post', 'sound-post'],
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
    autor: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      enum: ['en', 'ru', 'ua'],
      required: true
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  {
    timestamps: true
  }
);

CategorySchema.plugin(mongooseSlugPlugin, {
  tmpl: '<%=title%>',
  slug: limax
});
CategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', CategorySchema);
