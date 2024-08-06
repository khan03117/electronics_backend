const Banner = require("../models/Banner");
const mongoose = require('mongoose');

const _create = async (req, res) => {
    const { url, sub_type, type } = req.body;
    const data = { url: url, type: type };
    if (type == "brand") {
        data['seller'] = sub_type
    }
    if (type == "category") {
        data['category'] = sub_type
    }
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
    const { type, sub_type } = req.query;

    const filter = type ? { type } : {};
    if (type && type == "brand" && mongoose.Types.ObjectId.isValid(sub_type)) {
        filter['seller'] = sub_type
    }
    if (type && type == "category" && mongoose.Types.ObjectId.isValid(sub_type)) {
        filter['category'] = sub_type
    }
    await Banner.find(filter).populate('seller').populate('category').sort({ createdAt: 1 }).then((resp) => {
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