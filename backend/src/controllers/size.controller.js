const SizeService = require('../services/size.service');

class SizeController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await SizeService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả size thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await SizeService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách size thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách size',
                error: error.message
            });
        }
    }
    
    async create(req, res) {
        try {
            const data = await SizeService.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Thêm size thành công',
                data
            })
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
            const data = await SizeService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật size thành công',
                data
            })
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await SizeService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy Size để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công Size'
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SizeController();