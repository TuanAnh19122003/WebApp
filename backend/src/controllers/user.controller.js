const UserService = require('../services/user.service');
const path = require('path');
const fs = require('fs');

class UserController {
    async findAll(req, res) {
        try {
            const users = await UserService.findAll();
            res.status(200).json({
                message: 'Lấy danh sách thành công',
                users
            })
        } catch (error) {
            console.log('Lỗi: ', error);
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách',
                data
            })
        }
    }

    async create(req, res) {
        try {
            const data = req.body;
            const file = req.file;
            const user = await UserService.create(data, file);

            res.status(200).json({

                message: 'Thêm thành công',
                user
            })
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi thêm người dùng',
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const file = req.file;
            const update = await UserService.update(id, data, file);

            res.status(201).json({
                message: 'Cập nhật thành công người dùng',
                user: update
            })
        } catch (error) {
            console.log('Lỗi: ', error);
            res.status(401).json({
                message: "Đã xảy ra lỗi khi cập nhật người dùng",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {

            const id = req.params.id;
            const deletedCount = await UserService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công người dùng'
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa người dùng",
                error: error.message
            });
        }
    }

}

module.exports = new UserController();