const Category = require('../models/category.model');

class CategoryService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;
        
        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
            ];
        }
        
        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }
        const categories = await Category.findAndCountAll(queryOptions);
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