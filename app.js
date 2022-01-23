const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NotFoundError = require('./errors/not-found-err');

const userRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 1000, // you can make a maximum of 100 requests from one IP
});

mongoose.connect('mongodb://localhost:27017/news', {
  useNewUrlParser: true,
});

mongoose.connection
  .once('open', () => {
    console.log('Connected');
  })
  .on('error', (error) => {
    console.log('Your Error', error);
  });

const { PORT = 3000 } = process.env;

const app = express();
app.use(
  cors({
    origin: '*',
  })
);

app.use(limiter);

app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', userRoutes);
app.use('/', articlesRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {});
