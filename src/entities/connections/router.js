const express = require('express');
const router = express.Router();

const Ctrl = require('./controller');
const getUserByUserID = require('../authentication/controller').getUserByUserID;
const requestConnection = Ctrl.requestConnection;
const checkRequest = Ctrl.checkRequest;
const getSentConnections = Ctrl.getSentConnections;
const getReceivedConnections = Ctrl.getReceivedConnections;
const getConnections = Ctrl.getConnections;
const approveReceivedConnections = Ctrl.approveReceivedConnections;

const isSameUser = require('../middlewares/middleware').isSameUser;

router.get('/', (req, res, next) => {
  const { user } = req.session;

  getConnections(user)
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
  const { userID: senderID, username: senderName } = req.session.user;
  let { userID: receiverID } = req.params;
  receiverID = parseInt(receiverID);

  let user;
  
  getUserByUserID(receiverID)
    .then(user => {
      user = user;
      const { username: receiverName } = user;
      delete user.password;

      checkRequest(senderID, receiverID)
        .then(result => {
          if (result) {
            return res.status(403).json({
              status: 403,
              message: 'Connection request already sent'
            });
          }

          requestConnection(senderID, senderName, receiverID, receiverName, 0)
            .then(() => {
              res.status(200).json({
                status: 200,
                message: 'Connection request sent',
                receiver: user
              });
            })
            .catch(err => {
              let message = '';

              switch(err) {
                case 500:
                  message = 'Internal server error in sending connection request';
                  break;
              }

              res.status(err).json({ status: err, message });
            });
        })
        .catch(err => {
          let message = '';

          switch(err) {
            case 500:
              message = 'Internal server error while sending request';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        })
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
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.put('/approve/:userID', (req, res, next) => {
  const { userID: receiverID } = req.session.user;
  let { userID: senderID } = req.params;
  senderID = parseInt(senderID);

  let receivedConnection;
  checkRequest(senderID, receiverID)
    .then(result => {
      if (result) {
        receivedConnection = result;
        return approveReceivedConnections(senderID, receiverID);
      }
      
      res.status(404).json({
        status: 404,
        message: 'Connection request not found'
      });
    })
    .then(() => {
      const { senderID, senderName, receiverID, receiverName} = receivedConnection;

      return requestConnection(receiverID, receiverName, senderID, senderName, 1);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: 'Successfully approved connection request',
        request: receivedConnection
      });
    })
    .catch(err => {
      let message = '';

      switch(err) {
        case 500:
          message = 'Internal server error while approving connection request';
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

module.exports = router;