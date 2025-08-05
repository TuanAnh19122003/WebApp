const Category = require('../models/category.model');

class CategoryService {
    static async findAll() {
        const categories = await Category.findAll();
        return categories;
    }

    static async create(data) {
        const category = await Category.create(data);
        return category;
    }

    static async update(id, data) {
        const category = await Category.findOne({ where: { id: id } });
        if (!category) throw new Error('Category not found');
        return await category.update(data);
    }

    static async delete(id) {
        return await Category.destroy({ where: { id: id } });
    }

}

module.exports = CategoryService;