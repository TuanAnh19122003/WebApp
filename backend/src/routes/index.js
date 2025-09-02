const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const categoryRouter = require('./category.routes');
const productRouter = require('./product.routes');
const sizeRouter = require('./size.routes');
const productSizeRouter = require('./product_size.routes');
const discountRouter = require('./discount.routes');
const cartRouter = require('./cart.routes');
const orderRouter = require('./order.routes');
const contactRouter = require('./contact.routes');
const paypalRoutes = require('./paypal.routes');
const addressRouter = require('./address.routes');
const aiRouter = require('./ai.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/sizes', sizeRouter);
router.use('/product_sizes', productSizeRouter);
router.use('/discounts', discountRouter);
router.use('/carts', cartRouter);
router.use('/orders', orderRouter);
router.use('/contacts', contactRouter);
router.use('/paypal', paypalRoutes);
router.use('/address', addressRouter);
router.use('/ai', aiRouter);

module.exports = router;