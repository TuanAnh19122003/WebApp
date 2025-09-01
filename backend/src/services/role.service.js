const Role = require('../models/role.model');

class RoleService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;
        
        const whereClause = {};
        if (search) {
            const { Op, where } = require('sequelize');
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

        const roles = await Role.findAndCountAll(queryOptions);
        return roles;
    }

    static async create(data) {
        const role = await Role.create(data);
        return role;
    }

    static async update(id, data) {
        const role = await Role.findOne({ where: { id: id } });
        if (!role) throw new Error('Role không tồn tại');
        return await role.update(data)
    }

    static async delete(id) {
        return await Role.destroy({ where: { id: id } })
    }

}

module.exports = RoleService;