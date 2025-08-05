const Size = require('../models/size.model');

class SizeService {
    static async findAll() {
        const sizes = await Size.findAll();
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