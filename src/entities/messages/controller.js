const db = require('../../database/index');
const messageQueries = require('./queries');

exports.getMessages = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(messageQueries.getMessages, [userID, userID], (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.getSentMessages = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(messageQueries.getSentMessages, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.getReceivedMessages = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(messageQueries.getReceivedMessages, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.sendMessage = function(senderID, receiverID, message) {
  return new Promise((resolve, reject) => {
    db.query(messageQueries.sendMessage, [senderID, receiverID, message], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      else if (!result.affectedRows) return reject(501);
      return resolve();
    });
  });
}