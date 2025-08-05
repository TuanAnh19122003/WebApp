module.exports = (db) => {
    const { Product, Size, ProductSize, Category, User, Role, Discount, Cart, CartItem, Order, OrderItem } = db;

    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(User, { foreignKey: 'roleId', as: 'user' });

    Product.hasMany(ProductSize, { foreignKey: 'productId', as: 'product_size' });
    ProductSize.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    Size.hasMany(ProductSize, { foreignKey: 'sizeId', as: 'product_size' });
    ProductSize.belongsTo(Size, { foreignKey: 'sizeId', as: 'size' });

    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'product' });

    Product.belongsTo(Discount, { foreignKey: 'discountId', as: 'discount' });
    Discount.hasMany(Product, { foreignKey: 'discountId', as: 'product' });

    Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });

    CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
    Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'cart_item' });

    CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    CartItem.belongsTo(Size, { foreignKey: 'sizeId', as: 'size' });

    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Order, { foreignKey: 'userId', as: 'order' });

    Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'order_item' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    OrderItem.belongsTo(Size, { foreignKey: 'sizeId', as: 'size' });
};
