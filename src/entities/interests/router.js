const express = require('express');
const router = express.Router();

const Ctrl = require('./controller');
const getInterests = Ctrl.getInterests;
const addInterest = Ctrl.addInterest;
const getUserWithInterests = Ctrl.getUserWithInterests;

/*
  TODO
    fix adding user interests
      -> same interests must not duplicate in database
      -> trailing whitespaces must not be added as part of interest in table
*/

router.post('/add', (req, res, next) => {
  const { userID } = req.session.user;
  const { interests } = req.body;
  const args = { userID, interests };

  Promise.all(addInterest(args))
    .then(() => {
      getUserWithInterests(userID)
        .then(result => {
          res.status(200).json({
            status: 200,
            message: 'Successfully added user interests',
            data: result
          });
        })
        .catch(err => {
          let message = '';

          switch(err) {
            case 500:
              message = 'Internal server error while adding user interests';
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while adding interest';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    })
});

router.get('/', (req, res, next) => {
  let { userID } = req.session.user;
  getInterests(userID)
    .then(values => {
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched interests',
        data: values
      });
    })
    .catch(err => {
      let message = '';

      switch(err) {
        case 500:
          message = 'Internal server error while fetching interests'
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});


module.exports = router;