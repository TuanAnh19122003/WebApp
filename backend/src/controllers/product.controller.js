const ProductService = require('../services/product.service');

class ProductController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                result = await ProductService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả sản phẩm thành công',
                    data: result.rows,
                    total: result.count,
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ProductService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách sản phẩm thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize,
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm',
                error: error.message,
            });
        }
    }

    async create(req, res) {
        try {
            const data = await ProductService.create(req.body, req.file);
            res.status(200).json({
                success: true,
                message: 'Thêm sản phẩm thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await ProductService.update(req.params.id, req.body, req.file);
            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await ProductService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công sản phẩm'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa sản phẩm",
                error: error.message
            });
        }
    }

    async findAllWithSizes(req, res) {
        try {
            const data = await ProductService.findAllWithSizes();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách sản phẩm kèm size thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy sản phẩm kèm size',
                error: error.message
            });
        }
    }

}

module.exports = new ProductController();