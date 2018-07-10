const userCtrl = function(repo) {
  const controller = {
    // get /user controller
    getUsers: (req, res) => {
      let users;
      let { user } = req.session;

      repo.getUsers(user)
        .then(result => {
          users = result[0];
          users.map(user => {
            delete user.password;
          });

          return Promise.all(repo.getUsersWithInterests(users));
        })
        .then(result => {
          result.forEach((userInterests, i) => {
            users[i].interests = userInterests;
          });

          res.status(200).json({
            status: 200,
            message: 'Successfully fetched uses',
            data: users
          })
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetching users';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },

    // delete /user controller
    deleteUser: (req, res) => {
      let { user } = req.session;

      delete user.password;

      repo.deleteUser(user)
        .then(() => {
          req.session.destroy();
          res.status(200).json({
            status: 200,
            message: 'Successfully deleted user',
            data: user
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while deleting user';
              break;
            case 404:
              message = 'User does not exist';
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

module.exports = userCtrl;