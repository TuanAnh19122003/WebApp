const { client: paypalClient } = require('../config/paypal');
const Order = require('../models/order.model');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

exports.capture = async (req, res) => {
    try {
        const { orderId } = req.query;
        const order = await Order.findByPk(orderId);

        if (!order || !order.paypal_order_id) {
            return res.status(404).json({ message: 'Order not found or not paid via PayPal' });
        }

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(order.paypal_order_id);
        request.requestBody({});

        const capture = await paypalClient().execute(request);

        order.status = 'paid';
        await order.save();

        res.json({
            success: true,
            message: 'PayPal payment captured',
            data: order,
            paypal: capture.result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'PayPal capture failed',
            error: err.message
        });
    }
};
