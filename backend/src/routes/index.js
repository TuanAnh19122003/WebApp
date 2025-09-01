const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const categoryRouter = require('./category.routes');
const sizeRouter = require('./size.routes');
const discountRouter = require('./discount.routes');
const productRouter = require('./product.routes');
const productSizeRouter = require('./product_size.routes')

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/sizes', sizeRouter);
router.use('/discounts', discountRouter);
router.use('/products', productRouter);
router.use('/product_sizes', productSizeRouter);

module.exports = router;