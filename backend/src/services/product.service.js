const Product = require('../models/product.model');
const Category = require('../models/category.model');
const path = require('path');
const fs = require('fs');
const Discount = require('../models/discount.model');
const db = require('../models/index');

class ProductService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { '$category.name$': { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                },
                {
                    model: Discount,
                    as: 'discount',
                    attributes: ['name', 'percentage']
                }
            ],
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const data = await Product.findAndCountAll(queryOptions);
        return data;
    }

    static async create(data, file) {
        if (file) {
            data.image = `uploads/${file.filename}`
        }
        const product = await Product.create(data);
        return product;
    }

    static async update(id, data, file) {
        const product = await Product.findOne({ where: { id: id } });
        if (!product) throw new Error('Product not found');
        if (file) {
            if (product.image) {
                const oldImagePath = path.join(__dirname, '..', product.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        if (data.discountId === '' || data.discountId === 'null' || data.discountId === null) {
            data.discountId = null;
        } else {
            data.discountId = parseInt(data.discountId, 10);
            if (isNaN(data.discountId)) {
                data.discountId = null;
            }
        }

        return await product.update(data);
    }

    static async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) return 0;

        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return await Product.destroy({ where: { id } });
    }

    static async findAllWithSizes() {
        const [results] = await db.sequelize.query(`
            SELECT 
                c.id AS category_id,
                c.name AS category_name,
                p.id AS product_id,
                p.name AS product_name,
                p.image,
                p.description,
                p.is_active,
                s.id AS size_id,
                s.name AS size_name,
                p.price AS base_price,
                ps.additional_price,
                (p.price + ps.additional_price) AS price_with_additional,
                d.percentage AS discount_percentage,

                ROUND(
                    CASE
                        WHEN d.id IS NOT NULL 
                        AND NOW() BETWEEN d.start_date AND d.end_date
                        THEN (p.price + ps.additional_price) * (1 - d.percentage / 100)
                        ELSE (p.price + ps.additional_price)
                    END, 2
                ) AS final_price

            FROM categories c
            LEFT JOIN products p ON p.categoryId = c.id
            LEFT JOIN product_sizes ps ON p.id = ps.productId
            LEFT JOIN sizes s ON s.id = ps.sizeId
            LEFT JOIN discounts d ON p.discountId = d.id;

        `);

        return results;
    }

}

module.exports = ProductService;