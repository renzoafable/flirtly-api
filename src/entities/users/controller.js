const db = require('../../database/index');
const userQueries = require('./queries');

const formatUserBody = require('../../utilities');

const defaultAttr = {
  middleName: '',
  city: '',
  province: '',
};

exports.getUsers = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(userQueries.getUsers, userID,(err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      return resolve(results);
    });
  });
}

exports.deleteUser = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(userQueries.deleteUser, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        reject(500);
      }
      else if (!results.affectedRows) return reject(404);
      return resolve();
    });
  });
}