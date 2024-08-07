const { validationResult } = require("express-validator");
const Seller = require("../models/Seller");

const _create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            success: 0,
            error: errors.array(),
            data: [],
            message: "Create new Brand failed"
        });
    }
    const { title } = req.body;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await Seller.findOne({ url: url });
    if (isExists) {
        return res.json({
            success: 0,
            error: errors.array(),
            data: [],
            message: "title already exists"
        });
    }
    if (!isExists) {
        const data = {
            title: title, url: url
        }
        if (req.file) {
            data['image'] = req.file.path
        }
        await Seller.create({ ...data }).then((resp) => {
            return res.json({
                success: 0,
                error: errors.array(),
                data: resp,
                message: "Seller created successfully"
            });
        })
    }
}
const getall = async (req, res) => {
    await Seller.find({}).then((resp) => {
        return res.json({
            success: 0,
            error: [],
            data: resp,
            message: "Seller fetched successfully"
        });
    })
}
const _destroy = async (req, res) => {
    const { id } = req.params;
    const resp = await Seller.deleteOne({ _id: id });

    return res.json({
        success: 0,
        error: [],
        data: resp,
        message: "Seller deleted successfully"
    });

}

const _update = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await Seller.findOne({ url: url, _id: { $ne: id } });

    if (isExists) {
        return res.json({
            success: 0,
            error: [],
            data: [],
            message: "title already exists"
        });
    }
    const data = {
        title: title, url: url
    }
    if (req.file) {
        data['image'] = req.file.path
    }
    await Seller.updateOne({ _id: id }, { ...data }).then((resp) => {
        return res.json({
            success: 1,
            error: [],
            data: [],
            message: "Seller updated successfully"
        })
    })
}

module.exports = {
    _create, _destroy, _update, getall
}