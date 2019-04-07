const express = require('express');
const mongoose = require('mongoose');
const ENV = require('dotenv');
const cors = require('cors');

ENV.config();

const UserRoutes = require('./routes/user.route');
const PostRoutes = require('./routes/post.route');
const TagRoutes = require('./routes/tag.route');
const ImageRoutes = require('./routes/image.route');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Config CORS
const whitelist = process.env.WHITELIST.split(',');
app.use(
  cors({
    origin: whitelist
  })
);

// Static files folder
app.use('/uploads', express.static(`${__dirname}/uploads`));

// Routes
app.use('/api/image', ImageRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/tags', TagRoutes);

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
