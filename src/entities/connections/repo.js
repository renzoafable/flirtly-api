const queries = require('./queries');

const connectionsRepo = function (db) {
  const repo = {
    requestConnection: (userID, connectionID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.requestConnection, [userID, connectionID], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }
          return resolve(result[0]);
        });
      });
    },

    getAllConnections: (userID, connectionID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getAllConnections, [userID, connectionID],
          (err, result) => {
            if (err) {
              console.log(err.message);
              return reject(500);
            }
            return resolve(result[0]);
          });
      });
    },

    getSentConnections: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getSentConnections, userID, (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getReceivedConnections: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getReceivedConnections, userID, (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getConnectionsOfUser: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getConnectionsOfUser, [userID, userID], (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getConnectionOfUser: ({ userID: senderID }, receiverID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getConnectionOfUser, [senderID, receiverID], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          else if (!result.length) return reject(404);

          return resolve(result[0]);
        });
      });
    },

    getApprovedConnectionOfUser: ({ userID: senderID }, receiverID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getApprovedConnection, [senderID, receiverID], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          else if (!result.length) return reject(404);

          return resolve(result[0]);
        });
      });
    },

    approveReceivedConnections: ({ userID: receiverID }, senderID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.approveReceivedConnections, [receiverID, senderID], (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getPendingRequest: (connectionID, userID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getPendingRequest, [connectionID, userID], (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results[0]);
        });
      });
    },

    deleteRequest: (userID, connectionID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.deleteConnection, [userID, connectionID], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(result);
        })
      });
    }
  }

  return repo;
}

module.exports = connectionsRepo;