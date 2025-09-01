const OrderService = require('../services/order.service');

class OrderController {
    async findAll(req, res) {
        try {
            const orders = await OrderService.findAll();
            res.status(200).json({
                message: 'Orders fetched successfully',
                orders
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createOrder(req, res) {
        try {
            const { items, totalPrice, note } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!items || items.length === 0) {
                return res.status(400).json({ message: 'Order must have at least one item' });
            }

            const order = await OrderService.create(userId, items, totalPrice, note);
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (err) {
            console.error('Error in createOrder:', err);
            res.status(500).json({ message: 'Failed to create order' });
        }
    };

    async getOrdersByUser(req, res) {
        try {
            const userId = req.user?.id || req.params.id;
            const orders = await OrderService.getOrdersByUser(userId);
            res.status(200).json({
                message: 'Orders fetched successfully',
                orders
            });
        } catch (err) {
            console.error('Error in getOrdersByUser:', err);
            res.status(500).json({ message: 'Failed to fetch orders' });
        }
    };

    async updateOrderStatus(req, res) {
        try {
            const { orderId, status } = req.body;
            const updated = await OrderService.updateOrderStatus(orderId, status);
            res.status(200).json({ message: 'Order status updated', order: updated });
        } catch (err) {
            console.error('Error in updateOrderStatus:', err);
            res.status(500).json({ message: 'Failed to update order status' });
        }
    };

    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            const result = await OrderService.delete(orderId);
            res.status(200).json(result);
        } catch (err) {
            console.error('Error in deleteOrder:', err);
            res.status(500).json({ message: 'Failed to delete order' });
        }
    };


}

module.exports = new OrderController();