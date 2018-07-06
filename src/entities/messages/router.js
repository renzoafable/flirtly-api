const express = require('express');
const router = express.Router();

const isSameUser = require('../middlewares/middleware').isSameUser;

const Ctrl = require('./controller');
const getApprovedConnectionOfUser = require('../connections/controller').getApprovedConnectionOfUser;
const getMessages = Ctrl.getMessages;
const getSentMessages = Ctrl.getSentMessages;
const getReceivedMessages = Ctrl.getReceivedMessages;
const sendMessage = Ctrl.sendMessage;

router.get('/', (req, res, next) =>{
  const { user } = req.session;

  getMessages(user)
    .then(results => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched messages',
        messages: results
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while fetching messages';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.get('/sent', (req, res, next) => {
  const { user } = req.session;

  getSentMessages(user)
    .then(results => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched sent messages',
        sentMessages: results
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while fetching sent messages';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.get('/received', (req, res, next) => {
  const { user } = req.session;

  getReceivedMessages(user)
    .then(results => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched received messages',
        receivedMessages: results
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while fetching received messages';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.post('/send/:userID', isSameUser, (req, res, next) => {
  const { user } = req.session;
  const { params } = req;

  const senderID = user.userID;
  const receiverID = parseInt(params.userID);
  const { message } = req.body;


  getApprovedConnectionOfUser(user, receiverID)
    .then(() => {
      return sendMessage(senderID, receiverID, message);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: 'Successfully sent message'
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while sending message';
          break;
        case 501:
          message = 'Something went wrong';
          break;
        case 404:
          message = 'Contact not found';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

module.exports = router;