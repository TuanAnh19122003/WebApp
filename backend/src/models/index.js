const sequelize = require('../config/database');
const User = require('./user.model');
const Role = require('./role.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Size = require('./size.model');
const ProductSize = require('./product_size.model');
const Discount = require('./discount.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Contact = require('./contact.model');

const db = {
    User,
    Role,
    Product,
    Category,
    ProductSize,
    Size,
    Discount,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Contact,
    sequelize
}

require('./initRelationships')(db);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;