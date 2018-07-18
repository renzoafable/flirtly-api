const express = require('express');
const session = require('express-session');
const store = require('express-mysql-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database');
const router = require('./router');

const MySQLStore = store(session);
const sessionStore = new MySQLStore({}, db);

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('User connected');
  socket.on('message', (message) => {
    socket.broadcast.emit(`message/${message.senderID}`, message);
    socket.broadcast.emit(`message/${message.receiverID}`, message);
  });
});

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}))

// session store
app.use(session({
  key: 'flirtly',
  secret: 'flirtly',
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  createDatabaseTable: true,
  checkExpirationInterval: 9000000,
  expiration: 86400000,
}));

app.use('/api', router);

app.use('*', (req, res) => res.redirect('/'));

// listen to port
const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
