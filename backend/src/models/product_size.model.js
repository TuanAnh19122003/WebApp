const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product.model');
const Size = require('./size.model');

const ProductSize = sequelize.define('ProductSize', {
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    sizeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'sizes',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    additional_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'product_sizes',
    indexes: [
        {
            unique: true,
            fields: ['productId', 'sizeId']
        }
    ],
})

module.exports = ProductSize;