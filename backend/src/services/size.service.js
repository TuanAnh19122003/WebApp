const Size = require('../models/size.model');

class SizeService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {}
        if(search){
            const { Op, where } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'ASC']],
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const sizes = await Size.findAndCountAll(queryOptions);
        return sizes;
    }

    static async create(data) {
        const size = await Size.create(data);
        return size;
    }

    static async update(id, data) {
        const size = await Size.findOne({ where: { id: id } });
        if (!size) throw new Error('Size not found');
        return await size.update(data);
    }

    static async delete(id) {
        return await Size.destroy({ where: { id: id } });
    }
}

module.exports = SizeService;