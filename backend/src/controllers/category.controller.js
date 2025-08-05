const CategoryService = require('../services/category.service');

class CategoryController {
    async findAll(req, res) {
        try {
            const categories = await CategoryService.findAll();
            res.status(201).json({
                message: 'Lấy thành công dữ liệu',
                categories
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
    }


    async create(req, res) {
        try {
            const category = await CategoryService.create(req.body);
            res.status(201).json({
                message: 'Thêm thành công',
                category
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
    }

    async update(req, res) {
        try {
            const category = await CategoryService.update(req.params.id, req.body);
            res.status(201).json({
                message: 'Cập nhật thành công',
                category
            });
        } catch (error) {
            res.status(500).json({
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

            res.status(201).json({
                message: 'Xóa thành công'
            });
        } catch (error) {
            res.status(500).json({
                message: "Đã xảy ra lỗi khi xóa danh mục",
                error: error.message
            });
        }
    }
}

module.exports = new CategoryController();