const { validationResult } = require('express-validator');
const PolicyModel = require('../models/Policy');




const _create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array(), success: 0 });
    }
    const { policy_id, title, description } = req.body;
    const url = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    if (policy_id) {

        let fdata = {
            url: url,
            _id: { $ne: policy_id }
        };
        const isExits = await PolicyModel.findOne(fdata);
        if (isExits) {
            return res.json({ errors: [{ 'title': "policy already exists for this title." }], data: [], success: 0, message: "Create New Policy failed" });
        }

        await PolicyModel.updateOne({ _id: policy_id }, { url: url, title: title, description: description }).then((resp => {
            return res.json({ errors: [], data: [], success: 1, message: "Policy Updated Successfully" });
        }));

    }

    const isExists = await PolicyModel.findOne({ url: url });
    if (!isExists) {
        const data = new PolicyModel({ title: title, url: url, description: description })
        await data.save().then((resp) => {
            return res.json({ errors: [], data: [], success: 1, message: "Create New Policy" });
        })
    }

}
const get_policies = async (req, res) => {
    const items = await PolicyModel.find({}, { description: 0 });
    return res.json({ errors: [], data: items, success: 1, message: "List of Policies" });
}
const get_policy = async (req, res) => {
    const url = req.params.url;
    const items = await PolicyModel.findOne({ url: url });
    return res.json({ errors: [], data: items, success: 1, message: "Policy Data" });

}
const get_policy_by_id = async (req, res) => {
    const id = req.params.id;
    const items = await PolicyModel.findOne({ _id: id });
    return res.json({ errors: [], data: items, success: 1, message: "Policy Data" });
}
module.exports = {
    _create, get_policies, get_policy, get_policy_by_id, loadpage, generatepdf
}