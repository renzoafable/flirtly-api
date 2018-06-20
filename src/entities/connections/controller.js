const db = require('../../database/index');
const connectionQueries = require('./queries');

exports.requestConnection = function(senderID, senderName, receiverID, receiverName) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.requestConnection, [senderID, senderName, receiverID, receiverName], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve();
    });
  });
}

exports.checkRequest = function(senderID, receiverID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getPendingConnectionOfUsers, [senderID, receiverID],
      (err, result) => {
        if (err) {
          console.log(err.message);
          return reject(500);
        }
        return resolve(result[0]);
      });
  });
}

exports.getSentConnections = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getSentConnections, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
      
      return resolve(results);
    });
  });
}

exports.getReceivedConnections = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getReceivedConnections, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}