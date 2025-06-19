const Category = require('../models/category.model');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const { toPascalCase } = require('../utils/stringHelpers');

exports.createCategory = async (req, res) => {
  try {
    let { name, description } = req.body;
    const pascalName = toPascalCase(name);

    // Check for existing category by normalized name (case and space insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: `^${pascalName.replace(/ /g, '[\\s]*')}$`, $options: 'i' }
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name: pascalName, description });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
