const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const ProductController = require('../controllers/product.controller');

router.get('/', ProductController.findAll);
router.get('/with-sizes', ProductController.findAllWithSizes);
router.post('/', upload.single('image'), ProductController.create);
router.put('/:id', upload.single('image'), ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;