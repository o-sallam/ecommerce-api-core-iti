const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST create a new category
router.post('/', categoryController.createCategory);

module.exports = router;
