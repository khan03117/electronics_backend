const Category = require("../models/Category");

const _create = async (req, res) => {
    const title = req.body.title;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await Category.findOne({ url: url });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exits" }],
            data: [],
            message: "Create new category failed"
        })
    }
    let data = {
        title: title,
        url: url
    }
    if (req.file) {
        data['image'] = req.file.path
    }
    await Category.create(data).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Create new category"
        })
    })
}
const _get_all = async (req, res) => {
    let fdata = {
        is_hidden: false
    }
    await Category.find(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Category fetched successfully."
        })
    })
}
const _delete = async (req, res) => {

    const id = req.params.category_id;
    const fdata = { _id: id }
    await Category.deleteOne(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Category Deleted successfully."
        })
    })
}
const _update = async (req, res) => {
    const {id} = req.params;
    const title = req.body.title;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await Category.findOne({ url: url, _id: { $ne: id } });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exits" }],
            data: [],
            message: "Create new category failed"
        })
    }
    let data = {
        title: title,
        url: url
    }
    if (req.file) {
        data['image'] = req.file.path
    }
    const fdata = { _id: id }
    await Category.updateOne(fdata, data).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Category updated successfully"
        })
    })
}
module.exports = {
    _create, _get_all, _delete, _update
}


