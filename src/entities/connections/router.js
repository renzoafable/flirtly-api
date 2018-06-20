const express = require('express');
const router = express.Router();

const Ctrl = require('./controller');
const getUserByUserID = require('../authentication/controller').getUserByUserID;
const requestConnection = Ctrl.requestConnection;
const checkRequest = Ctrl.checkRequest;
const getSentConnections = Ctrl.getSentConnections;
const getReceivedConnections = Ctrl.getReceivedConnections;

const isSameUser = require('../middlewares/middleware').isSameUser;

router.post('/add/:userID', isSameUser, (req, res, next) => {
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

          requestConnection(senderID, senderName, receiverID, receiverName)
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