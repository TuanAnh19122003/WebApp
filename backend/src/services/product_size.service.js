const Product = require('../models/product.model');
const ProductSize = require('../models/product_size.model');
const Size = require('../models/size.model');

class ProductSizeService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { '$product.name$': { [Op.like]: `%${search}%` } },
                { '$size.name$': { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name'],
                    required: true
                },
                {
                    model: Size,
                    as: 'size',
                    attributes: ['name'],
                    required: true
                }
            ],
            order: [['createdAt', 'ASC']]
        }

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const data = await ProductSize.findAndCountAll(queryOptions);
        return data;
    }

    static async create(data) {
        const productSize = await ProductSize.create(data);
        return productSize;
    }

    static async update(productId, sizeId, updateData) {
        const existingRecord = await ProductSize.findOne({
            where: {
                productId: productId,
                sizeId: sizeId
            }
        });

        if (!existingRecord) {
            throw new Error('Không tìm thấy bản ghi để cập nhật');
        }

        const [affectedRows] = await ProductSize.update(updateData, {
            where: {
                productId: productId,
                sizeId: sizeId
            }
        });

        if (affectedRows === 0) {
            throw new Error('Cập nhật không thành công');
        }

        return updateData;

    }

    static async delete(productId, sizeId) {
        const deleted = await ProductSize.destroy({
            where: {
                productId: productId,
                sizeId: sizeId
            }
        });

        if (!deleted) {
            throw new Error('Không tìm thấy bản ghi để xoá');
        }

        return { productId, sizeId };
    }

}

module.exports = ProductSizeService;