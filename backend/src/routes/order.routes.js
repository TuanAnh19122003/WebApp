const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

router.get('/', OrderController.findAll);
router.post('/', OrderController.createOrder);
router.get('/user/:id', OrderController.getOrdersByUser);
router.put('/status', OrderController.updateOrderStatus);
router.delete('/:orderId', OrderController.deleteOrder);

module.exports = router;