const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const categoryRouter = require('./category.routes');
const sizeRouter = require('./size.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/sizes', sizeRouter);

module.exports = router;