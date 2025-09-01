const CategoryService = require('../services/category.service');

class CategoryController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await CategoryService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả loại sản phẩm thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await CategoryService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách loại sản phẩm thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách loại sản phẩm',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await CategoryService.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Thêm danh mục thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                message: error.message,
            })
        }
    }

    async update(req, res) {
        try {
            const data = await CategoryService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await CategoryService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    message: 'Không tìm thấy danh mục để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công danh mục'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa danh mục",
                error: error.message
            });
        }
    }
}

module.exports = new CategoryController();