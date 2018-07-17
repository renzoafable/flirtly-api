const middlewares = function () {
  const mw = {
    isLoggedIn: (req, res, next) => {
      if (req.session.user) {
        return next();
      }

      res.status(401).json({
        status: 401,
        message: 'You must be logged in'
      });
    },

    isSameUser: (req, res, next) => {
      const { user } = req.session;
      req.params.userID = parseInt(req.params.userID);
      if (user.userID !== req.params.userID) {
        return next();
      }

      res.status(403).json({
        status: 403,
        message: 'Cannot perform action with user'
      });
    }
  }

  return mw;
}

module.exports = middlewares;