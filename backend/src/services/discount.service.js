const Discount = require('../models/discount.model');

class DiscountService {
    static async findAll() {
        const discounts = await Discount.findAll();
        return discounts;
    }

    static async create(data) {
        const discount = await Discount.create(data);
        return discount;
    }

    static async update(id, data) {
        const discount = await Discount.findOne({ where: { id: id } });
        if (!discount) throw new Error('Discount not found');
        return await discount.update(data);
    }

    static async delete(id) {
        const discount = await Discount.findOne({ where: { id: id } });
        if (!discount) throw new Error('Discount not found');
        return await discount.destroy();
    }
}

module.exports = DiscountService;