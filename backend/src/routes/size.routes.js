const express = require('express');
const router = express.Router();

const SizeController = require('../controllers/size.controller');

router.get('/', SizeController.findAll);
router.post('/', SizeController.create);
router.put('/:id', SizeController.update);
router.delete('/:id', SizeController.delete);

module.exports = router;