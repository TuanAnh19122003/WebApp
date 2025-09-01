const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    paymentMethod: {
        type: DataTypes.ENUM('cod', 'paypal'),
        defaultValue: 'cod',
        allowNull: false,
    },
    paypal_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'orders',
    timestamps: true,
});

module.exports = Order;
