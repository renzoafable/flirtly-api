const bcrypt = require('bcrypt');

const queries = require('./queries');
const formatUserBody = require('../../utilities').formatUserBody;

const authRepo = function (db) {
  const repo = {
    signin: ({ username, password }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getUser, username, (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }
          else if (!result.length) return reject(404);
          else {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
              if (err) return reject(500);
              else if (!isMatch) return reject(400);
              return resolve(result[0]);
            });
          }
        });
      });
    },

    signup: (user) => {
      return new Promise((resolve, reject) =>{
        db.query(queries.addUser, formatUserBody(user), (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(result[0][0]['LAST_INSERT_ID()']);
        });
      });
    },
    
    getUserByUserID: (userID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getUserByUserID, userID, (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }
          else if (!result[0].length) reject(404);
          return resolve(result[0][0]);
        });
      });
    }
  }

  return repo;
}

module.exports = authRepo;