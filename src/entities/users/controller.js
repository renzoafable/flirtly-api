const db = require('../../database/index');
const connectionsRepo = require('../connections/repo')(db);

const userCtrl = function(repo) {
  const controller = {
    // get /user controller
    getUsers: (req, res) => {
      let users;
      let sentConnections = [];
      let receivedConnections = [];
      let connections = []
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

          return connectionsRepo.getSentConnections(user);
        })
        .then(result => {
          sentConnections = result;

          return connectionsRepo.getReceivedConnections(user);
        })
        .then(result => {
          receivedConnections = result;

          return connectionsRepo.getConnectionsOfUser(user);
        })
        .then(result => {
          connections = result;

          sentConnections = sentConnections.map(connection => connection.connectionID);
          receivedConnections = receivedConnections.map(connection => connection.userID);
          connections = connections.map(connection => connection.connectionID);

          console.log(connections);

          users = users.filter(user => !sentConnections.includes(user.userID));
          users = users.filter(user => !receivedConnections.includes(user.userID));
          users = users.filter(user => !connections.includes(user.userID));

          res.status(200).json({
            status: 200,
            message: 'Successfully fetched uses',
            data: users
          });
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