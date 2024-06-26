const Cart = require("../models/Cart");

const _create = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.json({
    //         errors: errors.array(),
    //         success: 0,
    //         message: "Errors occured",
    //         data: []
    //     });
    // }

    const { product, price, quantity, brand, modal } = req.body;
    const isExists = await Cart.findOne({ brand: brand, modal: modal, user: req.user });
    if (isExists) {
        const udata = {
            price: price,
            quantity: quantity
        }
        if (quantity == 0) {
            await Cart.deleteOne({ _id: isExists._id }).then(resp => {
                return res.json({
                    errors: [],
                    success: 1,
                    message: "Cart Deleted successfully",
                    data: resp
                });
            })
        }
        if (quantity != 0) {
            await Cart.updateOne({ _id: isExists._id }, udata).then(resp => {
                return res.json({
                    errors: [],
                    success: 1,
                    message: "Cart entry created successfully",
                    data: resp
                });
            })
        }

    } else {
        const data = { ...req.body, ['user']: req.user };
        await Cart.create(data).then(resp => {
            return res.json({
                errors: [],
                success: 1,
                message: "Cart entry created successfully",
                data: resp
            });
        })
    }


}
const get_all = async (req, res) => {
    // await Cart.deleteOne({ _id: "667ac71ee44aebb45c3bdbe1" });
    const items = await Cart.find({}).populate('product', 'title images').populate('modal', 'title image').populate('brand', 'title image');
    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry fetched successfully",
        data: items
    });
}
const mycarts = async (req, res) => {
    const items = await Cart.find({ user: req.user }).populate('product', 'title images').populate('modal', 'title image').populate('brand', 'title image');
    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry fetched successfully",
        data: items
    });
}
module.exports = {
    _create, get_all, mycarts
}