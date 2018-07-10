const db = require('../../database/index');
const connectionsRepo = require('../connections/repo')(db);

const messagesCtrl = function (repo) {
  const controller = {
    // get /message controller
    getMessages: (req, res) => {
      const { user } = req.session;

      repo.getMessages(user)
        .then(results => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched messages',
            data: results
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
    },
    // get /message/sent controller
    getSentMessages: (req, res) => {
      const { user } = req.session;

      repo.getSentMessages(user)
        .then(results => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched sent messages',
            data: results
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
    },
    // get /message/received controller 
    getReceivedMessages: (req, res) => {
      const { user } = req.session;

      repo.getReceivedMessages(user)
        .then(results => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched received messages',
            data: results
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
    },

    // post /send/:connectionID controller
    sendMessage: (req, res) => {
      const { user } = req.session;
      const { params } = req;

      const senderID = user.userID;
      const receiverID = parseInt(params.userID);
      const { message } = req.body;


      connectionsRepo.getApprovedConnectionOfUser(user, receiverID)
        .then(() => {
          return repo.sendMessage(senderID, receiverID, message);
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
    },
    // get /chat/:connectionID controller
    getChats: (req, res) => {
      const { user } = req.session;
      const { connectionID } = req.params;

      repo.getChats(user, connectionID)
        .then(results => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched chat messages',
            data: results
          })
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500:
              message = 'Internal server error while fetching chat messages';
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

module.exports = messagesCtrl;