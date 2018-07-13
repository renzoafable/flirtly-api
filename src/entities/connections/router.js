const express = require('express');
const router = express.Router();

const db = require('../../database/index');
const middlewares = require('../middlewares/middleware')();

const authRepo = require('../authentication/repo')(db)
const connectionsRepo = require('./repo')(db);
const connectionsCtrl = require('./controller')(connectionsRepo, authRepo);

router.get('/', connectionsCtrl.getConnectionsOfUser);
router.post('/send/:userID', middlewares.isSameUser, connectionsCtrl.requestConnection);
router.put('/approve/:userID', connectionsCtrl.approveReceivedConnections);
router.get('/sent', connectionsCtrl.getSentConnections);
router.get('/received', connectionsCtrl.getReceivedConnections);
router.delete('/sent/delete/:connectionID', connectionsCtrl.deleteSentRequest);
router.delete('/received/delete/:userID', connectionsCtrl.deleteReceivedRequest);

module.exports = router;