const Product = require('../models/product.model');
const ProductSize = require('../models/product_size.model');
const Size = require('../models/size.model');

class ProductSizeService {
    static async findAll() {
        const data = await ProductSize.findAll({
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                },
                {
                    model: Size,
                    as: 'size',
                    attributes: ['name']
                }
            ]
        });
        return data;
    }

    static async detail(productId, sizeId) {
        const data = await ProductSize.findOne({
            where: {
                productId: productId,
                sizeId: sizeId
            },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                },
                {
                    model: Size,
                    as: 'size',
                    attributes: ['name']
                }
            ]
        });

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