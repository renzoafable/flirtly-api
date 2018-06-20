const express = require('express');
const router = express.Router();

// middlewares
const middlewares = require('./entities/middlewares/middleware');
const isLoggedIn = middlewares.isLoggedIn;

const authRouter = require('./entities/authentication/router');
const userRouter = require('./entities/users/router');
const interestRouter = require('./entities/interests/router');

router.use(authRouter);
router.use(isLoggedIn);
router.use('/user', userRouter);
router.use('/interest', interestRouter);

module.exports = router;