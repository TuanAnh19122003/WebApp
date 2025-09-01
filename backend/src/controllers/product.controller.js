const ProductService = require('../services/product.service');

class ProductController {
    async findAll(req, res) {
        try {
            const products = await ProductService.findAll();
            res.status(200).json({
                message: 'Lấy danh sách sản phẩm thành công',
                products
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async detail(req, res) {
        try {
            const product = await ProductService.detail(req.params.id);
            res.status(200).json({
                message: 'lấy sản phẩm thành công',
                product
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const product = await ProductService.create(req.body, req.file);
            res.status(200).json({
                message: 'Thêm sản phẩm thành công',
                product
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const product = await ProductService.update(req.params.id, req.body, req.file);
            res.status(200).json({
                message: 'Cập nhật sản phẩm thành công',
                product
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await ProductService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    message: 'Không tìm thấy sản phẩm để xóa'
                });
            }

            res.status(200).json({
                message: 'Xóa thành công sản phẩm'
            });
        } catch (error) {
            res.status(500).json({
                message: "Đã xảy ra lỗi khi xóa sản phẩm",
                error: error.message
            });
        }
    }
}

module.exports = new ProductController();