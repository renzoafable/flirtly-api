const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Ctrl = require("./controller");
const signin = Ctrl.signin;
const signup = Ctrl.signup;
const getUserByUserID = Ctrl.getUserByUserID;

router.post("/signup", (req, res, next) => {
  let user;

  bcrypt.hash(req.body.password, 10, (err, result) => {
    const body = req.body;
    req.body.password = result;
    signup(req.body)
      .then(value => {
        const userID = value;
        getUserByUserID(userID)
          .then(user => {
            user = user;

            delete user.password;

            res.status(200).json({
              status: 200,
              message: "Successfully created user",
              user: user
            });
          })
          .catch(err => {
            let message = "";

            switch (err) {
              case 500:
                message = "Internal server error in fetching created user";
                break;
              case 404:
                message = "Created user not found";
                break;
              default:
                break;
            }

            res.status(err).json({ status: err, message });
          });
      })
      .catch(err => {
        let message = "";

        switch (err) {
          case 500:
            message = "Internal server error in adding user";
            break;
        }

        res.status(err).json({ status: err, message });
      });
  });
});

router.post("/signin", (req, res, next) => {
  const { user } = req.session;
  const { username } = req.body;
  if (user.username === username) {
    res.status(403).json({
      status: 403,
      message: "Already logged in",
      loggedUser: req.session.user
    });
  } else {
    signin(req.body)
      .then(result => {
        const user = result;

        delete user.password;
        req.session.user = user;

        res.status(200).json({
          status: 200,
          message: "Successfully logged in",
          user: user
        });
      })
      .catch(err => {
        let message = "";

        switch (err) {
          case 500:
            message = "Internal server error";
            break;
          case 400:
            message = "Invalid credentials";
            break;
          default:
            break;
        }

        res.status(err).json({ status: err, message });
      });
  }
});

router.post("/signout", (req, res, next) => {
  try {
    if (!req.session.user) {
      res.status(400).json({
        status: 400,
        message: "No user is logged in"
      });
    } else {
      req.session.destroy();
      res.status(200).json({
        status: 200,
        message: "Successfully logged out"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error while logging out"
    });
  }
});

router.post("/session", (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "Successfully fetched current session",
    session: req.session.user ? req.session.user : null
  });
});

module.exports = router;
