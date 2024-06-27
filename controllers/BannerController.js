const Banner = require("../models/Banner");

const _create = async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data['image'] = req.file.path
        const banner = await Banner.create(data);
        return res.json({
            errors: [],
            success: 1,
            message: "Banner created successfully",
            data: banner
        });
    } else {
        return res.json({
            errors: [{ path: 'image', msg: 'Image is required' }],
            success: 0,
            message: "Image is required",
            data: []
        });
    }
}
const delete_banner = async (req, res) => {
    const { id } = req.params;
    await Banner.deleteOne({ _id: id }).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Banner deleted successfully",
        });
    })
}
const update_banner = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
        data['image'] = req.file.path
    } else {
        return res.json({
            errors: [{ path: 'image', msg: 'Image is required' }],
            success: 0,
            message: "Image is required",
            data: []
        });
    }
    await Banner.updateOne({ _id: id }, data).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Banner updated successfully",
            data: resp
        });
    })
}
const getall = async (req, res) => {
    await Banner.find({}).sort({ createdAt: 1 }).then((resp) => {
        return res.json({
            errors: [],
            success: 1,
            message: "Banner fetched successfully",
            data: resp
        });
    })
}

module.exports = {
    _create, delete_banner, getall, update_banner
}