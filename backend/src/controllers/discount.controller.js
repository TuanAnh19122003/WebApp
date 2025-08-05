const DiscountService = require('../services/discount.service');

class DiscountController {
    async findAll(req, res) {
        try {
            const discounts = await DiscountService.findAll();
            res.status(201).json({
                message: 'Lấy dữ liệu thành công',
                discounts
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const discount = await DiscountService.create(req.body);
            res.status(201).json({
                message: 'Thêm thành công',
                discount
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const discount = await DiscountService.update(req.params.id, req.body);
            res.status(201).json({
                message: 'Cập nhật thành công',
                discount
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const discount = await DiscountService.delete(req.params.id);
            res.status(201).json({
                success: true,
                message: 'Xóa thành công',
            });
        } catch (error) {
            res.status(500).json({ 
                success: true, 
                error: error.message 
            });
        }
    }
}

module.exports = new DiscountController();