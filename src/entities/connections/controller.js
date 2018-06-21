const db = require('../../database/index');
const connectionQueries = require('./queries');

exports.requestConnection = function(userID, connectionID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.requestConnection, [userID, connectionID], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve();
    });
  });
}

exports.getAllConnections = function(userID, connectionID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getAllConnections, [userID, connectionID],
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

exports.getConnectionsOfUser = function({userID}) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getConnectionsOfUser, userID, (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.getConnectionOfUser = function({userID: senderID}, receiverID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getConnectionOfUser, [senderID, receiverID], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }
    
      else if(!result.length) return reject(404);

      return resolve(result[0]);
    });
  });
}

exports.approveReceivedConnections = function({userID: receiverID}, senderID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.approveReceivedConnections, [receiverID, senderID], (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results);
    });
  });
}

exports.getPendingRequest = function(connectionID, userID) {
  return new Promise((resolve, reject) => {
    db.query(connectionQueries.getPendingRequest, [connectionID, userID], (err, results) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve(results[0]);
    });
  });
}