const ProductSizeService = require('../services/product_size.service');

class ProductSizeController {
    async findAll(req, res) {
        try {
            const product_sizes = await ProductSizeService.findAll();
            res.status(200).json({
                message: 'Lấy danh sách size sản phẩm thành công',
                product_sizes
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async detail(req, res) {
        try {
            const { productId, sizeId } = req.params;
            const product_size = await ProductSizeService.detail(productId, sizeId);
            res.status(200).json({
                message: 'Lấy size sản phẩm thành công',
                product_size
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const product_size = await ProductSizeService.create(req.body);
            res.status(201).json({
                message: 'Thêm size sản phẩm thành công',
                product_size
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { productId, sizeId } = req.params;
            const updated = await ProductSizeService.update(productId, sizeId, req.body);
            res.status(200).json({
                message: 'Cập nhật size sản phẩm thành công',
                updated
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { productId, sizeId } = req.params;
            const deleted = await ProductSizeService.delete(productId, sizeId);
            res.status(200).json({
                message: 'Xóa size sản phẩm thành công',
                deleted
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductSizeController();
