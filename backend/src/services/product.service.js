const Product = require('../models/product.model');
const Category = require('../models/category.model');
const path = require('path');
const fs = require('fs');
const Discount = require('../models/discount.model');

class ProductService {
    static async findAll() {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                },
                {
                    model: Discount,
                    as: 'discount',
                    attributes: ['name']
                }
            ]
        });
        return products;
    }

    static async detail(id, data) {
        const product = await Product.findOne({ where: { id: id } });
        if (!product) throw new Error('Product not found');
        return product;
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

}

module.exports = ProductService;