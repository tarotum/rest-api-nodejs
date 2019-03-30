const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gim
    },
    password: {
      type: String,
      required: true,
      minlength: 10
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
