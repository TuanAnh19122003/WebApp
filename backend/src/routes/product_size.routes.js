const express = require('express');
const router = express.Router();
const controller = require('../controllers/product_sizes.controller');

router.get('/', controller.findAll);
router.post('/', controller.create);
router.put('/:productId/:sizeId', controller.update);
router.delete('/:productId/:sizeId', controller.delete);

module.exports = router;
