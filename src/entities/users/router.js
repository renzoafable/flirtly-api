const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const connectionRouter = require('../connections/router');
const Ctrl = require('./controller');
const getUsers = Ctrl.getUsers;
const deleteUser = Ctrl.deleteUser;

router.get('/', (req, res, next) => {
  let users;
  getUsers()
    .then(values => {
      users = values;

      users.map(user => delete user.password);

      res.status(200).json({
        status: 200,
        message: 'Successfully fetched users',
        users: users
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error in fetching users';
          break;
      
        default:
          break;
      }
      
      res.status(err).json({ status: err, message });
    });
});

router.delete('/', (req, res, next) => {
  let user = req.session.user;

  delete user.password;

  deleteUser(user)
    .then(() => {
      req.session.destroy();
      res.status(200).json({
        status: 200,
        message: 'Successfully deleted user',
        deletedUser: user
      });
    })
    .catch(err => {
      let message = '';

      switch(err) {
        case 500:
          message = 'Internal server error in deleting user';
          break;
        case 404:
          message = 'User does not exist';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.use('/connection', connectionRouter);

module.exports = router;