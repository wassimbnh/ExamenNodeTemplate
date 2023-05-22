var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const crud = require("./controllers/crud")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRoutes = require("./routes/userRoutes");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DB
mongoose.connect("mongodb://localhost:27017/", console.log("db connected"));

// Socket.io
var server = require('http').createServer(app);
var io = require("socket.io")(server);
var Chat = require("./models/schema");

io.on('connection', socket => {
  socket.broadcast.emit('user connected');

  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected');
  });

  socket.on("chat message", async data => {
    const message = new Chat({ pseudo: data.pseudo, message: data.message });
    socket.broadcast.emit("chat message", { data: message });
    await message.save();
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', { author: data.author });
  });
});

// Routes
app.get('/chat', async function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', async function(req, res, next) {
  try {
    const messages = await Chat.find({});
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

app.use(userRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", crud);

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

const port = 3000;
server.listen(port, console.log(`Server is active on port ${port}`));

module.exports = app;
