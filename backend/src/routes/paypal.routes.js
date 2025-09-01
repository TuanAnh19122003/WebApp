const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');

router.get('/capture', paypalController.capture);

module.exports = router;
