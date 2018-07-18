const connectionsCtrl = function (repo, authRepo) {
  const controller = {
    // get / controller
    getConnectionsOfUser: (req, res) => {
      const { user } = req.session;

      repo.getConnectionsOfUser(user)
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched user connections',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetchin user connections';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // post /send/:connectionID controller
    requestConnection: (req, res) => {
      const { userID } = req.session.user;
      let connectionID = parseInt(req.params.userID);

      let user;
      authRepo.getUserByUserID(connectionID)
        .then(user => {
          if (user) {
            user = user;
            return repo.getAllConnections(userID, connectionID);
          }
        })
        .then(result => {
          if (result.length) {
            return Promise.reject(403);
          }
          else return repo.requestConnection(userID, connectionID);
        })
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully sent connection request',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetching requested user';
              break;
            case 404:
              message = 'User not found';
              break;
            case 403:
              message = 'Request have been sent or established already';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // put /approve/:userID controller
    approveReceivedConnections: (req, res) => {
      const { user } = req.session;
      let { userID } = req.params;
      userID = parseInt(userID);

      repo.getPendingRequest(user.userID, userID)
        .then(result => {
          if (result) {
            receivedConnection = result;
            return repo.approveReceivedConnections(user, userID);
          }

          return Promise.reject(404);
        })
        .then(() => {
          return repo.getReceivedConnections(user);
        })
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully approved connection request',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while approving connection request';
              break;
            case 404:
              message = 'Connection request not found';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // get /sent controller
    getSentConnections: (req, res) => {
      const { user } = req.session;
      repo.getSentConnections(user)
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched sent connection requests',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetching sent connection requests';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // get /received controller
    getReceivedConnections: (req, res) => {
      const { user } = req.session;
      repo.getReceivedConnections(user)
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched received connection requests',
            data: result || null
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetching received connection requests';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // delete /sent/delete/:connectionID controller
    deleteSentRequest: (req, res) => {
      const { user } = req.session;
      const { connectionID } = req.params;

      repo.getConnectionOfUser(user, connectionID)
        .then(result => {
          const { userID, connectionID } = result;

          return repo.deleteRequest(userID, connectionID);
        })
        .then(() => {
          return repo.getSentConnections(user);
        })
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully canceled request',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while deleting request';
              break;
            case 404:
              message = 'Connection does not exist';
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // delete /received/delete/:connectionID controller
    deleteReceivedRequest: (req, res) => {
      const { user } = req.session;
      const { userID } = req.params;

      repo.getConnectionOfUser({ userID }, user.userID)
        .then(result => {
          const { userID, connectionID } = result;

          return repo.deleteRequest(userID, connectionID);
        })
        .then(() => {
          return repo.getReceivedConnections(user);
        })
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully deleted pending request',
            data: result
          })
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Iternal server error while deleting request';
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

module.exports = connectionsCtrl;