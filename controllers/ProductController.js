const { validationResult } = require('express-validator');

const PdModal = require('../models/Product');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Modal = require('../models/Modal');
const Brand = require('../models/Brand');


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
        const imagePaths = files.map(file => file.path);
        const { title, description, price, product_type, category, modals } = req.body;
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
        const newproduct = new PdModal({
            url: url,
            title: title,
            description: description,
            price: price,
            product_type: product_type,
            category: category,
            images: imagePaths,
            modals: modalsArray
        });
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
    const response = await PdModal.findOne({ _id: id, deleted_at: null })
        .populate('modals.brand') // Populate the 'brand' field in 'modals'
        .populate('modals.modal');

    return res.json({
        success: 1,
        error: [],
        data: response,
        message: "Product fetched successfully."
    })

}






exports.getallproduct = async (req, res) => {
    await PdModal.find({ deleted_at: null }).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Product fetched successfully."
        })
    })
}

exports.get_products = async (req, res) => {

    try {
        const { category_url, modal_url, brand_url } = req.query;

        const category = await Category.findOne({ url: category_url });
        const modal = await Modal.findOne({ url: modal_url });
        const brand = await Brand.findOne({ url: brand_url });
        let match = {
            deleted_at: null,
            is_hidden: false,
        }

        if (category) {
            match.category = category._id;
        }
        // if (modal) {
        //     match.modal = modal._id;
        // }
        // if (brand) {
        //     match.brand = brand._id;
        // }


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
                $match: {
                    ...(modal ? { "modals.modal": modal._id } : {}),
                    ...(brand ? { "modals.brand": brand._id } : {})
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

                    products: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: {
                        _id: '$_id',
                        title: '$categoryTitle',

                        products: '$products'
                    }
                }
            },
            {
                $sort: { 'category.title': 1 } // Sort by category title
            }
        ]);
        return res.json({
            success: 1,
            error: [],
            data: results,
            message: "Product fetched successfully."
        })
    } catch (error) {
        console.log(error)
    }
}




exports.updateproduct = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    const files = req.files;
    const title = req.body;
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
    const product = await Product.findOne({ _id: id });

    if (files) {
        const imagePaths = files.map(file => file.path);
        const images = product.images;
        imagePaths.forEach(img => {
            images.push(img);
        })
    }
};
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



