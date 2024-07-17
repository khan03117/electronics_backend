const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const PdModal = require('../models/Product');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Seller = require('../models/Seller');
const Wishlist = require('../models/Wishlist');
const Offer = require('../models/Offer');

const { ObjectId } = mongoose.Types;
exports.createproduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                errors: errors.array(),
                success: 0,
                message: "Errors occured",
                data: []
            });
        }
        const files = req.files;
        if (!files) {
            return res.json({
                errors: [],
                success: 0,
                message: "Images are required at least one image is required",
                data: []
            });
        }
        const imagePaths = files.map(file => file.path);
        const { title, description, price, product_type, category, modals, subcategory, seller, mrp } = req.body;
        if (!title) {
            return res.json({
                errors: [],
                success: 0,
                message: "title is required.",
                data: []
            });
        }
        if (!product_type) {
            return res.json({
                errors: [],
                success: 0,
                message: "product_type is required.",
                data: []
            });
        }
        if (!category) {
            return res.json({
                errors: [],
                success: 0,
                message: "category is required.",
                data: []
            });
        }
        if (!price) {
            return res.json({
                errors: [],
                success: 0,
                message: "price is required.",
                data: []
            });
        }
        const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

        const isExists = await Product.findOne({ url: url });
        if (isExists) {
            return res.json({
                success: 0,
                error: [{ path: "title", msg: "Already exits" }],
                data: [],
                message: "Product already exists"
            })
        }
        const modalsArray = JSON.parse(modals);
        const data = {
            url: url,
            title: title,
            description: description,
            price: price,
            product_type: product_type,
            category: category,
            images: imagePaths,
            modals: modalsArray,
            mrp: mrp

        }
        if (subcategory) {
            data['subcategory'] = subcategory;
        }
        if (seller) {
            data['seller'] = seller;
        }
        const newproduct = new PdModal(data);
        const savedproduct = await newproduct.save();
        res.status(201).json({
            success: 1,
            error: [],
            data: savedproduct,
            message: "Product created successfully."
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: "An error occurred while Creating the Product"
        });
    }
};
exports.get_product_by_id = async (req, res) => {
    const id = req.params.id;
    const response = await PdModal.findOne({ _id: id, deleted_at: null }).populate('category').populate('subcategory')
    return res.json({
        success: 1,
        error: [],
        data: response,
        message: "Product fetched successfully."
    })
}
exports.get_product_by_url = async (req, res) => {
    const url = req.params.url;
    const product = await PdModal.findOne({ url: url, deleted_at: null })
        .populate('category').populate('modals.modal').populate('modals.brand');
    if (!product) {
        return res.status(404).json({
            success: 0,
            error: ["Product not found."],
            data: null,
            message: "Product not found."
        });
    }
    const currentDate = new Date();
    const wishlistEntry = await Wishlist.findOne({ user: req.user, product: product._id });
    const isOffer = await Offer.findOne({
        product: product._id,
        is_Active: true,
        start_at: { $lte: currentDate },  // Offer with start_at less than or equal to the current date
        end_at: { $gte: currentDate },    // Offer with end_at greater than or equal to the current date
        start_at: { $exists: true },      // Offer with start_at exists
        end_at: { $exists: true }
    });
    return res.json({
        success: 1,
        error: [],
        data: product,
        is_wishlist: !!wishlistEntry,
        'wishlist': wishlistEntry,
        'offer': isOffer,
        message: "Product fetched successfully."
    })
}
exports.getallproduct = async (req, res) => {
    let { rows, page, category_id, subcategory_id, seller_id, keyword } = req.query;
    rows = rows ? parseInt(rows) : 5; // Default to 5 if not provided
    page = page ? parseInt(page) : 1; // Default to 1 if not provided

    try {
        const fdata = { deleted_at: null };
        if (category_id && ObjectId.isValid(category_id)) {
            fdata['category'] = category_id;
        }
        if (subcategory_id && ObjectId.isValid(subcategory_id)) {
            fdata['subcategory'] = subcategory_id;
        }
        if (seller_id && ObjectId.isValid(seller_id)) {
            fdata['seller'] = seller_id;
        }
        if (keyword && keyword.length > 3) {
            fdata['title'] = { $regex: keyword, $options: 'i' };
        }

        const totalDocs = await PdModal.countDocuments(fdata);
        const totalpage = Math.ceil(totalDocs / rows); // Use ceil to get the exact total pages
        const skip = Math.max(rows * (page - 1), 0);

        const products = await PdModal.find(fdata)
            .populate('category')
            .populate('subcategory')
            .populate('seller')
            .skip(skip)
            .limit(rows);

        return res.json({
            success: 1,
            error: [],
            data: products,
            totalpage: totalpage,
            totaldocs: totalDocs,
            message: "Product fetched successfully."
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: 0,
            error: ["Internal server error"],
            data: [],
            message: "Failed to fetch products."
        });
    }
};

exports.get_products = async (req, res) => {
    try {
        const { category_url, seller, subcategory } = req.query;

        const category = await Category.findOne({ url: category_url });
        let match = {
            deleted_at: null,
            is_hidden: false,
        }
        if (category) {
            match.category = category._id;
        }
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
            let filterd = {
                _id: subcategory
            }
            if (category) {
                filterd.category = category._id;
            }
            const fsubcategory = await SubCategory.findOne(filterd);
            if (fsubcategory) {
                match.subcategory = fsubcategory._id
            }
        }

        if (seller) {
            const fseller = await Seller.findOne({ url: seller });
            if (fseller) {
                match.seller = fseller._id
            }
        }
        const matchStage = { $match: match };
        const results = await PdModal.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'categories', // Name of the category collection
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },

            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$categoryDetails._id',
                    categoryTitle: { $first: '$categoryDetails.title' },
                    categoryIdx: { $first: '$categoryDetails.idx' },
                    products: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: {
                        _id: '$_id',
                        title: '$categoryTitle',
                        idx: '$categoryIdx',
                        products: '$products'
                    }
                }
            },
            {
                $sort: { 'category.idx': 1 } // Sort by category title
            }
        ]);
        return res.json({
            success: 1,
            error: [],
            data: results,
            message: "Product fetched successfully."
        });
    } catch (error) {
        console.log(error)
    }
}

exports.search_product = async (req, res) => {
    const { key } = req.params
    await PdModal.find({
        deleted_at: null,
        $or: [
            { title: { $regex: key, $options: 'i' } },
            { url: { $regex: key, $options: 'i' } },
            { 'category.title': { $regex: key, $options: 'i' } },
            { 'seller.title': { $regex: key, $options: 'i' } }
        ]
    })
        .populate('category')
        .populate('subcategory')
        .populate('seller')
        .then((response) => {
            return res.json({
                success: 1,
                error: [],
                data: response,
                message: "Product fetched successfully."
            })
        })
}




exports.updateproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, product_type, category, modals, subcategory, seller, mrp } = req.body;

        // Ensure url is generated based on the updated title
        const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

        // Check if the updated url already exists for another product
        const isExists = await Product.findOne({ url: url, _id: { $ne: id } });
        if (isExists) {
            return res.json({
                success: 0,
                error: [{ path: "title", msg: "Already exists" }],
                data: [],
                message: "Product already exists"
            });
        }

        // Retrieve the existing product
        const product = await Product.findOne({ _id: id });

        // Handle image uploads
        const files = req.files;
        if (files && files.length > 0) {
            const imagePaths = files.map(file => file.path);
            product.images.push(...imagePaths);
        }

        // Update product fields
        product.url = url;
        product.title = title;
        product.description = description;
        product.price = price;
        product.product_type = product_type;
        product.category = category;

        // Check and assign subcategory if present
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
            product.subcategory = subcategory; // Ensure subcategory is a valid ObjectId
        }

        // Check and assign mrp if present

        product.mrp = (mrp && mrp != "undefined") ? mrp : price * 1.25; // Ensure mrp is a valid number


        // Check and assign seller if present
        if (seller && mongoose.Types.ObjectId.isValid(seller)) {
            product.seller = seller;
        }

        // Parse and assign modals if present
        if (modals) {
            product.modals = JSON.parse(modals);
        }

        // Save updated product
        await product.save();

        return res.json({
            success: 1,
            error: [],
            data: product,
            message: "Product updated successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: 0,
            error: error.message,
            data: [],
            message: "Error updating product."
        });
    }
};

exports.delete_image = async (req, res) => {
    const { pid, id } = req.params;
    const product = await PdModal.findOne({ _id: pid });
    const images = product.images;
    images.splice(id, 1);
    product.images = images;
    await product.save();
    return res.json({
        success: 1,
        error: [],
        data: [],
        message: "Image Deleted successfully."
    })
}
exports.recommended_products = async (req, res) => {
    await PdModal.find({ deleted_at: null }).limit(10).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Product fetched successfully."
        })
    })
}

exports.deleteproduct = async (req, res) => {
    const id = await req.params.id;
    const fdata = { _id: id }
    await PdModal.deleteOne(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Product Deleted successfully."
        })
    })
}



