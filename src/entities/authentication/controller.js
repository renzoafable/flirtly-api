const bcrypt = require('bcrypt');

const db = require('../../database/index');
const authQueries = require('./queries');

const formatUserBody = require('../../utilities').formatUserBody;

exports.signin = function({username, password}) {
  return new Promise((resolve, reject) => {
    db.query(authQueries.getUser, username, (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      else if (!result.length) reject(400);
      else {
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
          if (err) reject(500);
          else if (!isMatch) reject(400);
          return resolve(result[0]);
        });
      }
    });
  });
}

exports.signup = function(user) {
  return new Promise((resolve, reject) => {
    db.query(authQueries.addUser, formatUserBody(user), (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      return resolve(results[0][0]['LAST_INSERT_ID()']);
    });
  });
}

exports.getUserByUserID = function(userID) {
  return new Promise((resolve, reject) => {
    db.query(authQueries.getUserByUserID, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      else if (!results[0].length) reject(404);
      return resolve(results[0][0]);
    });
  });
}