const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const ProductSize = require('./product_size.model');

const Size = sequelize.define('Size', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'sizes',
})


module.exports = Size;