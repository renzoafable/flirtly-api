const express = require('express');
const router = express.Router();

const db = require('../../database/index');

const interestRepo = require('./repo')(db);
const interestCtrl = require('./controller')(interestRepo);

router.get('/', interestCtrl.getInterests);
router.post('/add', interestCtrl.addInterest);
router.delete('/delete/:interestID', interestCtrl.deleteInterest);

module.exports = router;