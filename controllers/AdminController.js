const { validationResult } = require("express-validator");
const ContactMedia = require("../models/ContactMedia");
const Admin = require("../models/Admin");

const update_contact_media = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array(), is_success: 0 });
    }
    const { media_id, title, type, media_value } = req.body;
    const filter = { _id: media_id };
    const data = {
        title: title,
        type: type,
        media_value: media_value
    }
    if (media_id) {
        await ContactMedia.updateOne(filter, data).then((resp) => {
            return res.json({
                data: resp,
                errors: [],
                is_success: 1,
                message: "Media Udpated."
            })
        })
    } else {
        await ContactMedia.create(data).then((resp) => {
            return res.json({
                data: resp,
                errors: [],
                is_success: 1,
                message: "Media created successfully."
            })
        })
    }



}
const get_contact_media = async (req, res) => {
    //await Admin.create({ name: "Admin", 'email': "admin@login.com", 'mobile': "9090909090", "password": "ZX_$P@ssw0rd!2024" })
    const filter = {
        show_in_app: true
    };
    if (req.query.type) {
        filter['type'] = req.query.type;
    } else {
        filter['type'] = { $in: ['Contact', 'Social'] };
    }
    const items = await ContactMedia.find(filter);
    return res.json({
        data: items,
        errors: [],
        is_success: 1,
        message: "Media fetched successfully."
    })
}
const login = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    const isExists = await Admin.findOne(data);
    if (isExists) {
        const token = jwt.sign({ admin_id: isExists._id }, process.env.JWT_KEY, { expiresIn: "30 days" });

        return res.json({
            data: token,
            errors: [],
            success: 1,
            message: "Login successfully."
        })
    }
    if (!isExists) {
        return res.json({
            data: '',
            errors: [],
            success: 1,
            message: "Invalid username & password"
        })
    }

}


module.exports = {
    update_contact_media, get_contact_media, login
}