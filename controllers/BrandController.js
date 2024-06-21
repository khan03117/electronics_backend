const Brand = require('../models/Brand');
const Category = require('../models/Category');


exports.brand_create = async (req, res) => {
    const title = req.body.title;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const isExists = await Brand.findOne({ url: url });
    if (isExists) {
        return res.json({
            success: 0,
            error: [{ path: "title", msg: "Already exits" }],
            data: [],
            message: "Create new Brand failed"
        })
    }
    const cid = req.body.category;
    const isvalid = await Category.findOne({ _id: cid });
    if (!isvalid) {
        return res.json({
            success: 0,
            error: [{ path: "category", msg: "category id does not exits" }],
            data: [],
            message: "Create new Brand failed"
        })
    }
    let data = {
        title: title,
        url: url,
        category: cid
    }
    if (req.file) {
        data['image'] = req.file.path
    }
    await Brand.create(data).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Create new Brand"
        })
    })
}


exports.brandgetall = async (req, res) => {
    let fdata = {
        is_hidden: false,
        deleted_at: null
    }
    await Brand.find(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Brand fetched successfully."
        })
    })
}

exports.brand_delete = async (req, res) => {

    const id = await req.params.brand_id;

    const fdata = { _id: id }
    await Brand.deleteOne(fdata).then((response) => {
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Brand Deleted successfully."
        })
    })
}






exports.brand_update = async (req, res) => {
    try {
        const id = req.body;
        if (!id) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "id", msg: "Id is not provided" }],
                data: [],
                message: "Brand update failed"
            });
        }

        const title = req.body.title;
        const category = req.body.category;
        if (!title) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "title", msg: "Title is required" }],
                data: [],
                message: "Brand update failed"
            });
        }

        const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        const isExists = await Brand.findOne({ url: url, _id: { $ne: id } });
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
            category: category
        };

        if (req.file) {
            data['image'] = req.file.path;
        }

        const fdata = { _id: id };
        const response = await Brand.updateOne(fdata, data);
        if (response.nModified === 0) {
            return res.status(404).json({
                success: 0,
                error: [{ path: "id", msg: "Brand not found" }],
                data: [],
                message: "Brand update failed"
            });
        }

        return res.json({
            success: 1,
            error: [],
            data: data,
            message: "Brand updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: [error.message],
            data: [],
            message: "An error occurred while updating the brand"
        });
    }
};







exports.get_brandby_Category = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: 0,
                error: [{ path: "id", msg: "Category ID is required." }],
                data: [],
                message: "Category ID is missing."
            });
        }
        const response = await Brand.find({ category: id, is_hidden: false });
        return res.json({
            success: 1,
            error: [],
            data: response,
            message: "Brands fetched successfully by category."
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
