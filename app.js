var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = 3000;
const mongoose = require("mongoose");
const crud = require("./controllers/crud")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRoutes = require("./routes/userRoutes");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db
mongoose.connect("mongodb://localhost:27017/",
  console.log("db connected"));

app.listen(port,
  console.log(`Server is active on port ${port}`));

app.use(userRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api",crud)
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

const server = require("http").createServer(app);
const io = require("socket.io")(server);

module.exports = app;
