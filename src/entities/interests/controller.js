const db = require('../../database/index');
const interestQueries = require('./queries');

exports.getInterests = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(interestQueries.getUserWithInterests, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.addInterest = function({userID, interests}) {
  const promises = [];
  interests.split(',').forEach(interest => {
    interest = interest.replace(/^[ ]+|[ ]+$/g,''); // remove leading and trailing whitespaces
    promises.push(new Promise((resolve, reject) => {
      db.query(interestQueries.addInterest, [userID, interest], (err, result) => {
        if (err) {
          console.log(err.message);
          return reject(500);
        }

        return resolve(result[0][0]);
      });
    }));
  });
  
  return promises;
}

exports.deleteInterest = function({ userID }, interestID) {
  return new Promise((resolve, reject) => {
    db.query(interestQueries.deleteInterest, [userID, interestID], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(result);
    });
  });
}