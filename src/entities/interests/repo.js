const queries = require('./queries');

const interestRepo = function (db) {
  const repo = {
    getInterests: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getUserWithInterests, userID, (err, results) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(results);
        });
      });
    },

    addInterest: ({ userID, interests }) => {
      const promises = [];
      interests.split(',').forEach(interest => {
        interest = interest.replace(/^[ ]+|[ ]+$/g, ''); // remove leading and trailing whitespaces
        promises.push(new Promise((resolve, reject) => {
          db.query(queries.addInterest, [userID, interest], (err, result) => {
            if (err) {
              console.log(err.message);
              return reject(500);
            }

            return resolve(result[0][0]);
          });
        }));
      });

      return promises;
    },

    deleteInterest: ({ userID }, interestID) => {
      return new Promise((resolve, reject) => {
        db.query(queries.deleteInterest, [userID, interestID], (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }

          return resolve(result);
        });
      });
    }
  }

  return repo;
}

module.exports = interestRepo;