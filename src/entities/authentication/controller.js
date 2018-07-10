const bcrypt = require('bcrypt');

const authCtrl = function (repo) {
  const controller = {
    // /signin controller
    signin: (req, res) => {
      if (req.session.user) {
        res.status(403).json({
          status: 403,
          message: 'Already logged in',
          data: req.session.user
        });
      }
      else {
        repo.signin(req.body)
          .then(result => {
            const user = result;

            delete user.password;
            req.session.user = user;

            res.status(200).json({
              status: 200,
              message: 'Successfully signed in',
              data: user
            });
          })
          .catch(err => {
            let message = '';

            switch (err) {
              case 500:
                message = 'Internal server error on sign in';
                break;
              case 400:
                message = 'Invalid credentials';
                break;
              case 404:
                message = 'User not found';
              default:
                break;
            }

            res.status(err).json({ status: err, message });
          });
      }
    },

    // /signup controller
    signup: (req, res) => {
      let user;

      bcrypt.hash(req.body.password, 10, (err, result) => {
        req.body.password = result;

        repo.signup(req.body)
          .then(value => {
            const userID = value;

            return repo.getUserByUserID(userID);
          })
          .then(result => {
            user = result

            delete user.password;

            res.status(200).json({
              status: 200,
              message: 'Successfully created user',
              data: user
            });
          })
          .catch(err => {
            let message = '';

            switch (err) {
              case 500:
                message = 'Internal server error while creating user';
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
    },

    // /signout controller
    signout: (req, res) => {
      if (!req.session.user) {
        res.status(400).json({
          status: 400,
          message: 'No user is signed in'
        });
      }

      else  {
        req.session.destroy();

        res.status(200).json({
          status: 200,
          message: 'Successfully signed out user'
        });
      }
    },

    //  /session controller
    getSession: (req, res) => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched session',
        data: req.session.user ? req.session.user : null
      })
    }
  }

  return controller;
}

module.exports = authCtrl;