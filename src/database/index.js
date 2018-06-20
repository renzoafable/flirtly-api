const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'flirtly',
  password: 'flirtly',
  database: 'flirtly',
  insecureAuth: true,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Connected to ${connection.config.database}`);
  }
});

db.query('USE flirtly');

module.exports = db;