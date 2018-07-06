const express = require('express');
const router = express.Router();

const Ctrl = require('./controller');
const getUserByUserID = require('../authentication/controller').getUserByUserID;
const requestConnection = Ctrl.requestConnection;
const getAllConnections = Ctrl.getAllConnections;
const getSentConnections = Ctrl.getSentConnections;
const getReceivedConnections = Ctrl.getReceivedConnections;
const getConnectionsOfUser = Ctrl.getConnectionsOfUser;
const getConnectionOfUser = Ctrl.getConnectionOfUser;
const approveReceivedConnections = Ctrl.approveReceivedConnections;
const getPendingRequest = Ctrl.getPendingRequest;
const deleteRequest = Ctrl.deleteRequest;

const isSameUser = require('../middlewares/middleware').isSameUser;

router.get('/', (req, res, next) => {
  const { user } = req.session;

  getConnectionsOfUser(user)
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched user connections',
        connections: result
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
});

router.post('/send/:userID', isSameUser, (req, res, next) => {
  const { userID } = req.session.user;
  let connectionID  = parseInt(req.params.userID);
  
  let user;
  getUserByUserID(connectionID)
    .then(user => {
      if (user) {
        user = user;
        return getAllConnections(userID, connectionID);
      }
    })
    .then(result => {
      if (result.length) {
        return Promise.reject(403);
      }
      else return requestConnection(userID, connectionID);
    })
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully sent connection request',
        users: result
      });
    })
    .catch(err => {
      let message = '';

      switch(err) {
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
});

router.put('/approve/:userID', (req, res, next) => {
  const { user } = req.session;
  let { userID } = req.params;
  userID = parseInt(userID);

  getPendingRequest(user.userID, userID)
    .then(result => {
      if (result) {
        receivedConnection = result;
        return approveReceivedConnections(user, userID);
      }
      
      return Promise.reject(404);
    })
    .then(() => {
      return getReceivedConnections(user);
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

      switch(err) {
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
});

router.get('/sent', (req, res, next) => {
  const { user } = req.session;
  getSentConnections(user)
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched sent connection requests',
        sentRequests: result || null
      });
    })
    .catch(err => {
      let message = '';

      switch(err) {
        case 500:
          message = 'Internal server error while fetching sent connection requests';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    })
});

router.delete('/sent/delete/:connectionID', (req, res, next) => {
  const { user } = req.session;
  const { connectionID } = req.params;

  getConnectionOfUser(user, connectionID)
    .then(result => {
      const { userID, connectionID } = result;

      return deleteRequest(userID, connectionID);
    })
    .then(() => {
      return getSentConnections(user);
    })
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully canceled request',
        data: result || null
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
});

router.get('/received', (req, res, next) => {
  const { user } = req.session;
  getReceivedConnections(user)
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched received connection requests',
        receivedConnections: result || null
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
});

router.delete('/received/delete/:userID', (req, res, next) => {
  const { user } = req.session;
  const { userID } = req.params;

  getConnectionOfUser({userID}, user.userID)
    .then(result => {
      const { userID, connectionID } = result;

      return deleteRequest(userID, connectionID);
    })
    .then(() => {
      return getReceivedConnections(user);
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
});

module.exports = router;