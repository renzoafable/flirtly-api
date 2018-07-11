const express = require('express');
const router = express.Router();

const db = require('../../database/index');

const authRepo = require('../authentication/repo')(db)
const connectionsRepo = require('./repo')(db);
const connectionsCtrl = require('./controller')(connectionsRepo, authRepo);

const isSameUser = require('../middlewares/middleware').isSameUser;

router.get('/', connectionsCtrl.getConnectionsOfUser);
router.post('/send/:userID', isSameUser, connectionsCtrl.requestConnection);
router.put('/approve/:userID', connectionsCtrl.approveReceivedConnections);
router.get('/sent', connectionsCtrl.getSentConnections);
router.get('/received', connectionsCtrl.getReceivedConnections);
router.delete('/sent/delete/:connectionID', connectionsCtrl.deleteSentRequest);
router.delete('/received/delete/:userID', connectionsCtrl.deleteReceivedRequest);

module.exports = router;