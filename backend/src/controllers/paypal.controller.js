const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Order = require('../models/order.model');

/**
 * Create PayPal order
 */
const create = async (req, res) => {
    try {
        const { items } = req.body; // [{ name, price, quantity }]

        // Build items list
        const paypalItems = items.map((item) => ({
            name: item.name,
            unit_amount: {
                currency_code: "USD",
                value: parseFloat(item.price).toFixed(2),
            },
            quantity: String(item.quantity),
        }));

        // Calculate item total
        const itemTotal = paypalItems
            .reduce((sum, item) => sum + (parseFloat(item.unit_amount.value) * parseInt(item.quantity)), 0)
            .toFixed(2);

        // Create request
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: itemTotal,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: itemTotal,
                            },
                        },
                    },
                    items: paypalItems,
                },
            ],
        });

        const order = await paypalClient().execute(request);

        // Save to DB (giả sử model Order có trường paypal_order_id)
        const newOrder = await Order.create({
            paypal_order_id: order.result.id,
            status: "pending",
            total: itemTotal,
        });

        res.json({
            success: true,
            orderID: order.result.id,
            paypal: order.result,
            data: newOrder,
        });
    } catch (err) {
        console.error("Error in createOrder:", err);
        res.status(500).json({
            success: false,
            message: "PayPal order creation failed",
            error: err.message,
        });
    }
};

/**
 * Capture PayPal order
 */
const capture = async (req, res) => {
    try {
        const { orderId } = req.query;
        const order = await Order.findByPk(orderId);

        if (!order || !order.paypal_order_id) {
            return res.status(404).json({ message: "Order not found or not paid via PayPal" });
        }

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(order.paypal_order_id);
        request.requestBody({});

        const capture = await paypalClient().execute(request);

        order.status = "paid";
        await order.save();

        res.json({
            success: true,
            message: "PayPal payment captured",
            data: order,
            paypal: capture.result,
        });
    } catch (err) {
        console.error("Error in capture:", err);
        res.status(500).json({
            success: false,
            message: "PayPal capture failed",
            error: err.message,
        });
    }
};

module.exports = { create, capture };
