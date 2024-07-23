const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('Connecting to the database...');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB!');
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB: ', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.requestLogger);

module.exports = app;