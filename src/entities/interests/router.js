const express = require('express');
const router = express.Router();

const Ctrl = require('./controller');
const getInterests = Ctrl.getInterests;
const addInterest = Ctrl.addInterest;
const deleteInterest = Ctrl.deleteInterest;

/*
  TODO
    fix adding user interests
      -> same interests must not duplicate in database
      -> trailing whitespaces must not be added as part of interest in table
*/

router.post('/add', (req, res, next) => {
  const { user } = req.session;
  const { interests } = req.body;
  const args = { userID: user.userID, interests };
  Promise.all(addInterest(args))
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: 'Successfully added interest/s',
        data: result
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server error while adding interest';
          break;
        case 503:
          message = 'Something went wrong!';
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    })
});

router.get('/', (req, res, next) => {
  let { user } = req.session;
  getInterests(user)
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
        case 500:a
          message = 'Internal server error while fetching interests'
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

router.delete('/delete/:interestID', (req, res, next) => {
  const { user } = req.session;
  const { interestID } = req.params;

  deleteInterest(user, interestID)
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'Successfully deleted interest'
      });
    })
    .catch(err => {
      let message = '';

      switch (err) {
        case 500:
          message = 'Internal server erro while deleting interest';
          break;
        default:
          break;
      }

      res.status(err).json({ status: err, message });
    });
});

module.exports = router;