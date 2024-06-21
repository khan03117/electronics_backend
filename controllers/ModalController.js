const modal = require('../models/Modal')
const category = require('../models/Category')
const brand = require('../models/Brand')




exports.create_modal = async (req, res) => {
    const title = req.body.title;
    console.log(req.body)
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await modal.findOne({ url: url });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exits" }],
            data: [],
            message: "Create new modal failed"
        })
    }
    const cid = req.body.category;
    const isvalid = await category.findOne({ _id: cid });
    if (!isvalid) {
        return res.json({
            success: 0,
            error: [{ path: "modal", msg: "modal id does not exits" }],
            data: [],
            message: "Create new modal failed"
        })
    }
    const bid = req.body.brand;
    const bidvalid = await brand.findOne({ _id: bid });
    if (!bidvalid) {
        return res.json({
            success: 0,
            error: [{ path: "brand", msg: "brand id does not exits" }],
            data: [],
            message: "Create new modal failed"
        })
    }
    let data = {
        title: title,
        url: url,
        category: cid,
        brand: bid
    }
    if (req.file) {
        data['image'] = req.file.path
    }
    await modal.create(data).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Create new modal"
        })
    })
}




exports.modalgetall = async (req, res) => {

    let fdata = {
        is_hidden: false
    }

    await modal.find({}).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Modal fetched successfully."
        })
    })
}


exports.modal_delete = async (req, res) => {

    const id = await req.params.id;

    const fdata = { _id: id }
    await modal.deleteOne(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Modal Deleted successfully."
        })
    })
}



exports.modal_update = async (req, res) => {
    try {
        const id = req.body;
        if (!id) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "id", msg: "Id is not provided" }],
                data: [],
                message: "Modal update failed"
            });
        }

        const title = req.body.title;
        const category = req.body.category;
        const brand = req.body.brand;

        if (!title) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "title", msg: "Title is required" }],
                data: [],
                message: "Modal update failed"
            });
        }

        const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        const isExists = await modal.findOne({ url: url, _id: { $ne: id } });
        if (isExists) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "title", msg: "Title already exists" }],
                data: [],
                message: "Brand update failed"
            });
        }

        let data = {
            title: title,
            url: url,
            category: category,
            brand: brand
        };

        if (req.file) {
            data['image'] = req.file.path;
        }

        const fdata = { _id: id };
        const response = await modal.updateOne(fdata, data);
        if (response.nModified === 0) {
            return res.status(404).json({
                success: 0,
                error: [{ path: "id", msg: "Modal not found" }],
                data: [],
                message: "Modal update failed"
            });
        }

        return res.json({
            success: 1,
            error: [],
            data: data,
            message: "Modal updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: [error.message],
            data: [],
            message: "An error occurred while updating the Modal"
        });
    }
};




exports.getmodal_bybrand = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "id", msg: "Brand ID is required." }],
                data: [],
                message: "Brand ID is missing."
            });
        }
        const response = await modal.find({ brand: id, is_hidden: false });
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Modals fetched successfully by Brand."
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: [error.message],
            data: [],
            message: "An error occurred while fetching brands by category."
        });
    }
};