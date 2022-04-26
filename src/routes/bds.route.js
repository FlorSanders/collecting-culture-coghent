const express = require('express');
const router = express.Router();
const BDSController = require('../controllers/BDS.controller');

router.get('/', BDSController.get);
router.post('/', BDSController.post);

module.exports = router;