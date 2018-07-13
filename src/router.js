const express = require('express');
const router = express.Router();

// middlewares
const middlewares = require('./entities/middlewares/middleware')();

const authRouter = require('./entities/authentication/router');
const userRouter = require('./entities/users/router');

router.use(authRouter);
router.use(middlewares.isLoggedIn);
router.use('/user', userRouter);

module.exports = router;