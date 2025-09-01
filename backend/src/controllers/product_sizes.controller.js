const ProductSizeService = require('../services/product_size.service');

class ProductSizeController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // Không phân trang — lấy toàn bộ
                result = await ProductSizeService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả size thành công',
                    data: result.rows,
                    total: result.count,
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ProductSizeService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách size thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize,
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách size',
                error: error.message,
            });
        }
    }

    async create(req, res) {
        try {
            const data = await ProductSizeService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Thêm size sản phẩm thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { productId, sizeId } = req.params;
            const data = await ProductSizeService.update(productId, sizeId, req.body);

            res.status(200).json({
                success: true,
                message: 'Cập nhật size sản phẩm thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { productId, sizeId } = req.params;
            const data = await ProductSizeService.delete(productId, sizeId);
            res.status(200).json({
                success: true,
                message: 'Xóa size sản phẩm thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new ProductSizeController();
