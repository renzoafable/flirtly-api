const queries = require('./queries');

const messagesRepo = function (db) {
  const repo = {
    getMessages: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getMessages, [userID, userID], (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getSentMessages: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getSentMessages, userID, (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    getReceivedMessages: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getReceivedMessages, userID, (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    sendMessage: (senderID, receiverID, message) => {
      return new Promise((resolve, reject) => {
        db.query(queries.sendMessage, [senderID, receiverID, message], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }
          else if (!result.affectedRows) return reject(501);
          return resolve();
        });
      });
    },

    getChats: ({ userID }, connectionID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getChats, [userID, connectionID], (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results[0]);
        });
      });
    }
  }

  return repo;
}

module.exports = messagesRepo;