const Testimonial = require("../models/Testimonial");


const _create = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data['image'] = req.file.path
        }
        const tdata = await Testimonial.create(data);
        return res.json({
            errors: [],
            success: 1,
            message: "Testimonial created successfully",
            data: tdata
        });
    } catch (error) {
        return res.json({
            errors: error,
            success: 0,
            message: "Internal Error occured",
            data: []
        });
    }
}
const delete_testimonial = async (req, res) => {
    const { id } = req.params;
    await Testimonial.deleteOne({ _id: id }).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Testimonial deleted successfully",
        });
    })
}
const update_data = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
        data['image'] = req.file.path
    }
    await Testimonial.updateOne({ _id: id }, data).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Testimonial updated successfully",
            data: resp
        });
    })
}
const getall = async (req, res) => {
    await Testimonial.find({}).sort({ createdAt: 1 }).then((resp) => {
        return res.json({
            errors: [],
            success: 1,
            message: "Testimonial fetched successfully",
            data: resp
        });
    })
}

module.exports = {
    _create, delete_testimonial, getall, update_data
}