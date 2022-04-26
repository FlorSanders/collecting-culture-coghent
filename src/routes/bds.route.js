const express = require('express');
const router = express.Router();
const BDSController = require('../controllers/BDS.controller');

router.get('/', BDSController.get);
router.get('/gent', BDSController.get_sparql);

module.exports = router;