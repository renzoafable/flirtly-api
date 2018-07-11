const express = require('express');
const router = express.Router();


const isSameUser = require('../middlewares/middleware').isSameUser;

const db = require('../../database/index');

const connectionsRepo = require('../connections/repo')(db);
const messagesRepo = require('./repo')(db);
const messagesCtrl = require('./controller')(messagesRepo, connectionsRepo);

router.get('/', messagesCtrl.getMessages);
router.get('/sent', messagesCtrl.getSentMessages);
router.get('/received', messagesCtrl.getReceivedMessages);
router.post('/send/:userID', isSameUser, messagesCtrl.sendMessage);
router.get('/chat/:connectionID', messagesCtrl.getChats);

module.exports = router;