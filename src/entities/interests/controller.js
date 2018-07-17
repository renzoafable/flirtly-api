const interestCtrl = function (repo) {
  const controller = {
    // get / controller
    getInterests: (req, res) => {
      let { user } = req.session;

      repo.getInterests(user)
        .then(values => {
          res.status(200).json({
            status: 200,
            message: 'Successfully fetched interests',
            data: values
          });
        })
        .catch(err => {
          let message = '';

          switch (err) {
            case 500: a
              message = 'Internal server error while fetching interests'
              break;
            default:
              break;
          }

          res.status(err).json({ status: err, message });
        });
    },
    // post /add controller
    addInterest: (req, res) => {
      const { user } = req.session;
      const { interests } = req.body;
      const args = { userID: user.userID, interests };
      Promise.all(repo.addInterest(args))
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
    },
    // delete /delete/:interestID controller
    deleteInterest: (req, res) => {
      const { user } = req.session;
      const { interestID } = req.params;

      repo.deleteInterest(user, interestID)
        .then(() => {
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
    }
  }

  return controller;
}

module.exports = interestCtrl;