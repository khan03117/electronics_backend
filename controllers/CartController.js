const Cart = require("../models/Cart");
const Order = require("../models/Order");
const UserAddress = require("../models/UserAddress");

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

    const { price, quantity, brand, modal } = req.body;
    const isExists = await Cart.findOne({ brand: brand, modal: modal, user: req.user, is_ordered: false });
    if (isExists) {
        const udata = {
            price: price,
            quantity: quantity
        }
        if (quantity == 0) {
            await Cart.deleteOne({ _id: isExists._id, is_ordered: false }).then(resp => {
                return res.json({
                    errors: [],
                    success: 1,
                    message: "Cart Deleted successfully",
                    data: resp
                });
            })
        }
        if (quantity != 0) {
            await Cart.updateOne({ _id: isExists._id, is_ordered: false }, udata).then(resp => {
                return res.json({
                    errors: [],
                    success: 1,
                    message: "Cart entry updated successfully",
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

    const items = await Cart.find({}).populate('product', 'title images').populate('modal', 'title image').populate('brand', 'title image');
    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry fetched successfully",
        data: items
    });
}
const mycarts = async (req, res) => {
    const items = await Cart.find({ user: req.user, is_ordered: false }).populate('product', 'title images url').populate('modal', 'title image').populate('brand', 'title image');
    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry fetched successfully",
        data: items
    });
}
const delete_cart = async (req, res) => {
    const { id } = req.params;
    await Cart.deleteOne({ _id: id, is_ordered: false }).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Cart entry deleted successfully",
        });
    })
}
const update_cart = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body, ['user']: req.user };
    await Cart.updateOne({ _id: id }, data).then(resp => {
        return res.json({
            errors: [],
            success: 1,
            message: "Cart entry updated successfully",
            data: resp
        });
    })
}
async function generateOrderId() {
    const prefix = "ELEC";
    const currentOrderNumber = await Order.countDocuments();
    const numberOfZeros = 5; // Adjust this to match the number of zeros needed
    // Convert the current order number to a string and pad it with leading zeros
    let orderNumberStr = currentOrderNumber.toString().padStart(numberOfZeros, '0');
    // Combine the prefix with the padded order number
    let orderId = prefix + orderNumberStr;
    return orderId;
}
const checkout = async (req, res) => {
    const user = req.user;
    const { address, name, email, city, state, pincode } = req.body;
    const carts = await Cart.find({ user: user, is_ordered: false });
    const total = carts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const useraddress = new UserAddress({ user, address, name, email, city, state, pincode });
    const uaddress = await useraddress.save();

    const order_id = await generateOrderId();
    const order_date = new Date();
    const order = await new Order({ order_id, order_date, user, uaddress, total });
    const porder = await order.save();
    carts.forEach(async cart => {
        await Cart.updateOne({ _id: cart._id }, { order: porder._id, is_ordered: true });
    });
    return res.json({
        errors: [],
        success: 1,
    });


}
const myorders = async (req, res) => {
    const user = req.user;
    const orders = await Cart.find({ user: user, is_ordered: true }).populate('product', 'title images url').populate('modal', 'title image').populate('brand', 'title image').sort({ createdAt: -1 });
    return res.json({
        errors: [],
        success: 1,
        data: orders
    });
}
module.exports = {
    _create, get_all, mycarts, delete_cart, update_cart, checkout, myorders
}