const express = require('express');
const router = express.Router();

const db = require('../../database/index');
const queries = require('./queries');

// Inject dependencies
const authRepo = require('./repo')(db, queries);
const authCtrl = require('./controller')(authRepo);

router.post('/signin', authCtrl.signin);
router.post('/signup', authCtrl.signup);
router.post('/signout', authCtrl.signout);
router.post('/session', authCtrl.getSession);

module.exports = router;