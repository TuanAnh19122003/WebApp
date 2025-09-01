const { User, Product, Size } = require('../models');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');

class OrderService {
    static async findAll() {
        const orders = await Order.findAll({
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
            order: [['createdAt', 'DESC']],
        });

        return orders;
    }

    static async getOrdersByUser(id) {
        const order = await Order.findAll({
            where: { id },
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

    static async create(userId, items, totalPrice, note) {
        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.create(
                {
                    userId,
                    total_price: totalPrice,
                    note,
                },
                { transaction: t }
            );

            const orderItemsData = items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

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