const { User, Product, Size } = require('../models');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

class OrderService {
    static async findAll({ offset, limit }) {
        const orders = await Order.findAndCountAll({
            distinct: true,
            include: [
                { model: User, as: 'user' },
                {
                    model: OrderItem,
                    as: 'order_item',
                    include: [
                        { model: Product, as: 'product' },
                        { model: Size, as: 'size' },
                    ],
                },
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });


        return orders;
    }

    static async getOrdersByUser(id) {
        const order = await Order.findAll({
            where: { userId: id },
            include: [
                {
                    model: OrderItem,
                    as: 'order_item',
                    include: [
                        { model: Product, as: 'product' },
                        { model: Size, as: 'size' },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return order;
    }

    static async create(userId, items, totalPrice, note, shipping_address, paymentMethod = 'cod') {
        // Lấy unique productId và sizeId từ items
        const productIds = [...new Set(items.map(i => i.productId))];
        const sizeIds = [...new Set(items.map(i => i.sizeId))];

        // Truy vấn DB để lấy tên
        const [products, sizes] = await Promise.all([
            Product.findAll({ where: { id: productIds } }),
            Size.findAll({ where: { id: sizeIds } }),
        ]);

        // Tạo map để truy xuất nhanh
        const productMap = {};
        products.forEach(p => { productMap[p.id] = p.name; });

        const sizeMap = {};
        sizes.forEach(s => { sizeMap[s.id] = s.name; });

        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.create({
                userId,
                total_price: totalPrice,
                note,
                paymentMethod,
                shipping_address
            }, { transaction: t });

            const orderItemsData = items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

            if (paymentMethod === 'paypal') {
                const usdTotal = (totalPrice / 24000).toFixed(2);

                const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
                request.prefer('return=representation');
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: usdTotal,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: usdTotal,
                                },
                            },
                        },
                        description: `Order #${order.id}`,
                        items: items.map(item => ({
                            name: `${productMap[item.productId] || 'Sản phẩm'} - Size ${sizeMap[item.sizeId] || ''}`,
                            unit_amount: {
                                currency_code: 'USD',
                                value: (item.price / 24000).toFixed(2),
                            },
                            quantity: item.quantity.toString(),
                        }))
                    }],
                    application_context: {
                        brand_name: 'My Shop',
                        landing_page: 'LOGIN',
                        user_action: 'PAY_NOW',
                        return_url: `http://localhost:3000/paypal-success?orderId=${order.id}`,
                        cancel_url: `http://localhost:3000/payment-fail?orderId=${order.id}`,
                    },
                });

                const response = await paypalClient().execute(request);
                const paypalOrderId = response.result.id;
                const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;

                order.paypal_order_id = paypalOrderId;
                await order.save({ transaction: t });

                return { order, approveUrl };
            }

            return { order };
        });
    }

    static async update(orderId, { userId, note, items }) {
        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) throw new Error('Order not found');

            order.userId = userId ?? order.userId;
            order.note = note ?? '';

            await OrderItem.destroy({ where: { orderId }, transaction: t });

            const orderItemsData = items.map((item) => ({
                orderId,
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

            const totalPrice = orderItemsData.reduce((sum, item) => {
                return sum + item.quantity * item.price;
            }, 0);

            order.total_price = totalPrice;
            await order.save({ transaction: t });

            return order;
        });
    }


    static async updateOrderStatus(orderId, status) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.status = status;
        await order.save();
        return order;
    };

    static async updateOrderItemQuantity(orderItemId, newQuantity) {
        return await OrderItem.sequelize.transaction(async (t) => {
            const orderItem = await OrderItem.findByPk(orderItemId, {
                include: [
                    { model: Product, as: 'product' },
                    { model: Size, as: 'size' },
                ],
                transaction: t,
            });

            if (!orderItem) {
                throw new Error('Order item not found');
            }

            // Cập nhật số lượng
            orderItem.quantity = newQuantity;
            await orderItem.save({ transaction: t });

            // Tính lại tổng tiền đơn hàng
            const orderId = orderItem.orderId;

            const allItems = await OrderItem.findAll({
                where: { orderId },
                transaction: t,
            });

            const newTotal = allItems.reduce((sum, item) => {
                return sum + item.quantity * item.price;
            }, 0);

            // Cập nhật tổng tiền của order
            const order = await Order.findByPk(orderId, { transaction: t });
            order.total_price = newTotal;
            await order.save({ transaction: t });

            return {
                orderItem,
                newTotal,
            };
        });
    }

    static async delete(orderId) {
        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) throw new Error('Order not found');

            await OrderItem.destroy({ where: { orderId }, transaction: t });
            await order.destroy({ transaction: t });

            return { message: 'Order deleted successfully' };
        });
    }
}

module.exports = OrderService;