require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { default: mongoose } = require('mongoose');
const session = require('express-session');
const { default: axios } = require('axios');
const cors = require('cors')
const { jwt } = require('./middlewares/auth');

var app = express();

var fs = require('fs');
if (!fs.existsSync('./public/pins')){
    fs.mkdirSync('./public/pins', { recursive: true });
}
if (!fs.existsSync('./public/avatars')){
    fs.mkdirSync('./public/avatars', { recursive: true });
}

app.use(cors({
  origin: process.env.CLIENT_URL, // React app URL
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    // maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/pin', require('./routes/pin'))
app.use('/api/like', require('./routes/like'))
app.use('/api/comment', require('./routes/comment'))
app.use('/api/user', require('./routes/user'))

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
// });


async function connect() {
  try {
    const PORT = process.env.PORT || 3000
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('DB connected successfully')
    app.listen(PORT)
    console.log(`Server running on ${PORT}`)
  }
  catch (err) {
    console.log(err)
  }
}
connect()

module.exports = app;
