const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const routes = require('./routes');
const { default: mongoose } = require('mongoose');
const config = require('config');
const CronJobManager = require('./cronJobs/CronJobManager');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const startServer = async () => {
  try {

    console.log('Connecting to Database...');
    await mongoose.connect(config.database.connection);
    console.log("Database connected")

    CronJobManager.registerCronJobs();

    console.log("Job started")

  } catch (error) {

    console.log('Database Connection Error', error);

    process.exit(1);

  }
}

startServer();

module.exports = app;
