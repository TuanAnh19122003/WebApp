const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const UserController = require('../controllers/user.controller');

router.get('/', UserController.findAll);
router.post('/', upload.single('image'), UserController.create);
router.put('/:id', upload.single('image'), UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;