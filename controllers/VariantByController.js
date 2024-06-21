const { validationResult } = require('express-validator');
const VariantByModal = require('../models/VariationBy');





exports.createVariantBy = async (req, res) => {
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
        const { title } = req.body;
        const newVariantBy = new VariantByModal({
            title
        });
        const savedVariantBy = await newVariantBy.save();
        res.status(201).json({
            success: 1,
            error: [],
            data: savedVariantBy,
            message: "VariantBy created successfully."
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: "An error occurred while Creating the Variantby"
        });
    }
};







exports.variantbygetall = async (req, res) => {

    await VariantByModal.find({}).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "VariantBy fetched successfully."
        })
    })
}


exports.variantbydelete = async (req, res) => {

    const id = await req.params.id;

    const fdata = { _id: id }
    await VariantByModal.deleteOne(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "VariantBy Deleted successfully."
        })
    })
}



exports.updateVariantBy = async (req, res) => {

    const { id, title } = req.body; // Extracting updated title from request body

    try {
        // Check if the VariantBy document exists
        const variantBy = await VariantByModal.findById(id);

        if (!variantBy) {
            return res.status(404).json({ success: 0, error: ['VariantBy not found'], data: null });
        }


        variantBy.title = title;


        const updatedVariantBy = await variantBy.save();

        res.json({
            success: 1,
            error: [],
            data: updatedVariantBy,
            message: "VariantBy updated successfully."
        });
    } catch (err) {
        return res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: "An error occurred while Updaing the Variantby"
        });
    }
};
