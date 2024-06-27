const { validationResult } = require('express-validator');

const PdModal = require('../models/Product');
const Product = require('../models/Product');

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
        const results = await PdModal.aggregate([
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
    const { id, ...updatedData } = req.body;


    if (!id) {
        return res.status(400).json({
            success: 0,
            error: [{ path: "id", msg: "Id is not provided" }],
            data: [],
            message: "Proudct update failed"
        });
    }

    try {
        const updateproduct = await PdModal.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updateproduct) {
            return res.status(201).json({
                success: 1,
                error: [],
                data: savedproduct,
                message: "Product Updated successfully."
            });
        }

        return res.json({
            success: 1,
            error: [],
            data: updatedData,
            message: "Product Updated successfully."
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: "An error occurred while Update the Product"
        });
    }
};


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

