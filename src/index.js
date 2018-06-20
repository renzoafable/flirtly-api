const express = require('express');
const session = require('express-session');
const store = require('express-mysql-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./database');
const router = require('./router');

const app = express();
const MySQLStore = store(session);
const sessionStore = new MySQLStore({}, db);

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// session store
app.use(session({
  key: 'fsrmgtsys',
  secret: 'fsrmgtsys',
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  createDatabaseTable: true,
  checkExpirationInterval: 9000000,
  expiration: 86400000,
}));

app.use('/api', router);

// page error handling
app.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

// error catching
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status || 500,
      message: error.message,
    }
  });
});

app.use('*', (req, res) => res.redirect('/'));

// listen to port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
