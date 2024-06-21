const VariationByModal = require('../models/VariationBy')
const VariantModal = require('../models/Varient')


exports.getallvariant = async (req, res) => {

    await VariantModal.find({}).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Variant fetched successfully."
        })
    })
}







exports.createVariant = async (req, res) => {
    try {
        const create = new VariantModal(req.body)

        // await create.save()
        console.log(create)
        res.status(201).json({
            success: 1,
            error: [],
            data: create,
            message: "Variant created successfully."
        });
    } catch (e) {
        return res.status(500).json({
            success: 0,
            error: [err.message],
            data: [],
            message: "An error occurred while Creating the Variantby"
        });
    }
}
