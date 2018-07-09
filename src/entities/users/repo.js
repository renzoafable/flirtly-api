const userRepo = function (db, queries) {
  const repo = {
    getUsers: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.getUsers, userID, (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(500);
          }
          return resolve(result);
        });
      });
    },

    getUsersWithInterests: (users) => {
      const promises = [];
      users.forEach(user => {
        promises.push(new Promise((resolve, reject) => {
          db.query(queries.getUserWithInterests, user.userID, (err, result) => {
            if (err) {
              console.log(err.message);
              return reject(500);
            }

            return resolve(result);
          });
        }));
      });

      return promises;
    },

    deleteUser: ({ userID }) => {
      return new Promise((resolve, reject) => {
        db.query(queries.deleteUser, userID, (err, result) => {
          if (err) {
            console.log(err.message);
            reject(500);
          }
          else if (!result.affectedRows) return reject(404);
          return resolve();
        });
      });
    }
  }

  return repo;
}

module.exports = userRepo;