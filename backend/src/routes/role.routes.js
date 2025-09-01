const express = require('express');
const router = express.Router();

const RoleController = require('../controllers/role.controller');

router.get('/', RoleController.findAll);
router.post('/', RoleController.create);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.delete);

module.exports = router;