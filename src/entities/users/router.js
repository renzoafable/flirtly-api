const express = require('express');
const router = express.Router();

const db = require('../../database/index');

const connectionsRepo = require('../connections/repo')(db);
const userRepo = require('./repo')(db);
const userCtrl = require('./controller')(userRepo, connectionsRepo);

const connectionRouter = require('../connections/router');
const messageRouter = require('../messages/router');
const interestRouter = require('../interests/router');

router.get('/', userCtrl.getUsers);
router.delete('/', userCtrl.deleteUser);

router.use('/connection', connectionRouter);
router.use('/message', messageRouter);
router.use('/interest', interestRouter);

module.exports = router;