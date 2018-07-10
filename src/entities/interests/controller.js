const interestCtrl = function (repo) {
  const controller = {
    getInterests: (req, res) => {
      let { user } = req.session;

      repo.getInterests(user)
        .then(values => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched interests',
            data: values
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500: a
              message = 'Internal server error while fetching interests'
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },

    addInterest: (req, res) => {
      const { user } = req.session;
      const { interests } = req.body;
      const args = { userID: user.userID, interests };
      Promise.all(repo.addInterest(args))
        .then((result) => {
          res.status(200).json({
            status: 200,
            message: 'Successfully added interest/s',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while adding interest';
              break;
            case 503:
              message = 'Something went wrong!';
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        })
    },

    deleteInterest: (req, res) => {
      const { user } = req.session;
      const { interestID } = req.params;

      repo.deleteInterest(user, interestID)
        .then(() => {
          res.status(200).json({
            status: 200,
            message: 'Successfully deleted interest'
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server erro while deleting interest';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    }
  }

  return controller;
}

module.exports = interestCtrl;

// exports.getInterests = function({userID}) {
//   return new Promise((resolve, reject) => {
//     db.query(interestQueries.getUserWithInterests, userID, (err, results) => {
//       if (err) {
//         console.log(err.message);
//         return reject(500);
//       }

//       return resolve(results);
//     });
//   });
// }

// exports.addInterest = function({userID, interests}) {
//   const promises = [];
//   interests.split(',').forEach(interest => {
//     interest = interest.replace(/^[ ]+|[ ]+$/g,''); // remove leading and trailing whitespaces
//     promises.push(new Promise((resolve, reject) => {
//       db.query(interestQueries.addInterest, [userID, interest], (err, result) => {
//         if (err) {
//           console.log(err.message);
//           return reject(500);
//         }

//         return resolve(result[0][0]);
//       });
//     }));
//   });

//   return promises;
// }

// exports.deleteInterest = function({ userID }, interestID) {
//   return new Promise((resolve, reject) => {
//     db.query(interestQueries.deleteInterest, [userID, interestID], (err, result) => {
//       if (err) {
//         console.log(err.message);
//         return reject(500);
//       }

//       return resolve(result);
//     });
//   });
// }