const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');
const ProductSize = require('./product_size.model');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    discountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'discounts',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'products',
    
});



module.exports = Product;
