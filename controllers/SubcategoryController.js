const SubCategory = require('../models/SubCategory');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
// Create a new subcategory
exports.createSubCategory = async (req, res) => {
    const title = req.body.title;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    // Check if subcategory already exists
    const isExists = await SubCategory.findOne({ url: url });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exists" }],
            data: [],
            message: "Create new SubCategory failed"
        });
    }

    let data = {
        ...req.body,
        title: title,
        url: url
    };

    if (req.file) {
        data['image'] = req.file.path;
    }

    await SubCategory.create(data).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Create new SubCategory"
        });
    }).catch(err => {
        return res.json({
            success: 0,
            error: [{ path: "database", msg: err.message }],
            data: [],
            message: "Create new SubCategory failed"
        });
    });
};

// Update a subcategory by ID
exports.updateSubCategory = async (req, res) => {
    const subCategoryId = req.params.id;
    const title = req.body.title;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    // Check if subcategory with the new URL already exists (excluding the current subcategory)
    const isExists = await SubCategory.findOne({ url: url, _id: { $ne: subCategoryId } });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exists" }],
            data: [],
            message: "Update SubCategory failed"
        });
    }

    let data = {
        ...req.body,
        title: title,
        url: url
    };

    if (req.file) {
        data['image'] = req.file.path;
    }

    await SubCategory.findByIdAndUpdate(subCategoryId, data, { new: true }).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Update SubCategory"
        });
    }).catch(err => {
        return res.json({
            success: 0,
            error: [{ path: "database", msg: err.message }],
            data: [],
            message: "Update SubCategory failed"
        });
    });
};


// Get all subcategories
exports.getSubCategories = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category: category } : {};
        const subCategories = await SubCategory.find(filter).populate('category');
        res.status(200).json({
            success: 1,
            errors: [],
            data: subCategories,
            message: 'Subcategories fetched successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            errors: [{ path: 'server', msg: err.message }],
            data: [],
            message: 'Failed to fetch subcategories.'
        });
    }
};

// Get a subcategory by ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(404).json({
                success: 0,
                errors: [{ path: 'subcategory', msg: 'Subcategory not found' }],
                data: [],
                message: 'Failed to fetch subcategory.'
            });
        }
        const subCategory = await SubCategory.findById(id).populate('category');
        if (!subCategory) {
            return res.status(404).json({
                success: 0,
                errors: [{ path: 'subcategory', msg: 'Subcategory not found' }],
                data: [],
                message: 'Failed to fetch subcategory.'
            });
        }
        res.status(200).json({
            success: 1,
            errors: [],
            data: subCategory,
            message: 'Subcategory fetched successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: 0,
            errors: [{ path: 'server', msg: err.message }],
            data: [],
            message: 'Failed to fetch subcategory.'
        });
    }
};


exports.getSubCategoriesByCategory = async (req, res) => {
    try {

        const categoryId = req.params.categoryId;

        const subCategories = await SubCategory.find({ category: categoryId });


        if (!subCategories.length) {

            return res.status(404).json({
                success: 0,
                error: [{ path: "categoryId", msg: "No subcategories found for this category" }],
                data: [],
                message: "No subcategories found"
            });
        }

        res.json({
            success: 1,
            error: [],
            data: subCategories,
            message: "Subcategories fetched successfully"
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: 0,
            error: [{ path: "database", msg: err.message }],
            data: [],
            message: "Failed to fetch subcategories"
        });
    }
};

// Delete a subcategory by ID
exports.deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
        if (!deletedSubCategory) {
            return res.status(404).json({
                success: 0,
                errors: [{ path: 'subcategory', msg: 'Subcategory not found' }],
                data: [],
                message: 'Subcategory not found'
            });
        }
        return res.json({
            success: 1,
            errors: [],
            data: deletedSubCategory,
            message: 'Subcategory deleted successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: 0,
            errors: [{ path: 'server', msg: err.message }],
            data: [],
            message: 'Failed to delete subcategory'
        });
    }
};


