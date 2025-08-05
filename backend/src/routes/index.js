const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const categoryRouter = require('./category.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter)

module.exports = router;