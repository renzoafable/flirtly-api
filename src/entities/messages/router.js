const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares/middleware')();

const db = require('../../database/index');

const connectionsRepo = require('../connections/repo')(db);
const messagesRepo = require('./repo')(db);
const messagesCtrl = require('./controller')(messagesRepo, connectionsRepo);

router.get('/', messagesCtrl.getMessages);
router.get('/sent', messagesCtrl.getSentMessages);
router.get('/received', messagesCtrl.getReceivedMessages);
router.post('/send/:userID', middlewares.isSameUser, messagesCtrl.sendMessage);
router.get('/chat/:connectionID', messagesCtrl.getChats);

module.exports = router;