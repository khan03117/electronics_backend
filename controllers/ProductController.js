const { validationResult } = require('express-validator');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const PdModal = require('../models/Product')






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
        const newproduct = new PdModal(req.body);
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
