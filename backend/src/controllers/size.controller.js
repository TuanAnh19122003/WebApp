const SizeService = require('../services/size.service');

class SizeController {
    async findAll(req, res) {
        try {
            const sizes = await SizeService.findAll();
            res.status(201).json({
                message: 'Lấy dữ liệu thành công',
                sizes
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async create(req, res) {
        try {
            const size = await SizeService.create(req.body);
            res.status(201).json({
                message: 'Thêm thành công',
                size
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const size = await SizeService.update(req.params.id, req.body);
            res.status(201).json({
                message: 'Cập nhật thành công',
                size
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await SizeService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message 
            });
        }
    }
}

module.exports = new SizeController();