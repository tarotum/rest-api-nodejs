const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ENV = require('dotenv');

ENV.config();

const UserRoutes = require('./routes/user.route');
const PostRoutes = require('./routes/post.route');
const PostTagRoutes = require('./routes/postTag.route');

const app = express();

// Config bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files folder
app.use('/uploads', express.static(`${__dirname}/uploads`));

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/poststags', PostTagRoutes);

// Conntent DB
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      global.console.log(`Some problem with the connection ${err}`);
    } else {
      global.console.log('The Mongoose connection is ready');
      app.listen(process.env.PORT, () =>
        global.console.log(`Server is runing on http://localhost:${process.env.PORT}`)
      );
    }
  }
);
mongoose.set('useCreateIndex', true);
