const mongoose = require('mongoose');
const mongooseSlugPlugin = require('mongoose-slug-plugin');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const postSchema = new Schema(
  {
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
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'PostTag' }]
  },
  {
    timestamps: true
  }
);

postSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });
postSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Post', postSchema);
