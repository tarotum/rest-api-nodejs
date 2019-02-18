const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const PostRoutes = require('./routes/post');
const CategoryRoutes = require('./routes/category');

// Conntent DB
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
    process.env.DB_HOST
  }:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Some problem with the connection ' + err);
    } else {
      console.log('The Mongoose connection is ready');
    }
  }
);
mongoose.set('useCreateIndex', true);

const app = express();

// Config bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Static files folder
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/posts', PostRoutes);
app.use('/categories', CategoryRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server is runing on http://localhost:${process.env.PORT}`)
);
