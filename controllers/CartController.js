const ApplyPromo = require("../models/ApplyPromo");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const PromoCode = require("../models/PromoCode");
const User = require("../models/User");
const UserAddress = require("../models/UserAddress");
const Wishlist = require("../models/Wishlist");

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
        const data = { ...req.body, ['user']: req.user, is_ordered: false };
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

const mycart = async (req, res) => {
    try {
        const items = await Cart.aggregate([
            { $match: { is_ordered: false } },
            {
                $group: {
                    _id: "$product",
                    totalQuantity: { $sum: "$quantity" },
                    totalPrice: { $sum: { $multiply: ["$price", "$quantity"] } },
                    cartItems: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: 'modals',
                    localField: 'cartItems.modal',
                    foreignField: '_id',
                    as: 'modalDetails'
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'cartItems.brand',
                    foreignField: '_id',
                    as: 'brandDetails'
                }
            },
            {
                $project: {
                    _id: 0,
                    product: "$productDetails",
                    totalQuantity: 1,
                    totalPrice: 1,
                    cartItems: {
                        $map: {
                            input: "$cartItems",
                            as: "item",
                            in: {
                                _id: "$$item._id",
                                user: "$$item.user",
                                product: "$$item.product",
                                modal: {
                                    $arrayElemAt: [{
                                        $filter: {
                                            input: "$modalDetails",
                                            as: "modal",
                                            cond: { $eq: ["$$modal._id", "$$item.modal"] }
                                        }
                                    }, 0]
                                },
                                brand: {
                                    $arrayElemAt: [{
                                        $filter: {
                                            input: "$brandDetails",
                                            as: "brand",
                                            cond: { $eq: ["$$brand._id", "$$item.brand"] }
                                        }
                                    }, 0]
                                },
                                price: "$$item.price",
                                quantity: "$$item.quantity",
                                is_ordered: "$$item.is_ordered",
                                createdAt: "$$item.createdAt",
                                updatedAt: "$$item.updatedAt"
                            }
                        }
                    }
                }
            }
        ]);

        return res.json({
            errors: [],
            success: 1,
            message: "Cart entry fetched successfully",
            data: items
        });
    } catch (error) {
        return res.json({
            errors: [error.message],
            success: 0,
            message: "Failed to fetch cart entry",
            data: []
        });
    }
};

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
    const { address, name, email, city, state, pincode, payment_mode } = req.body;
    let address_id = req.body.address_id;
    const carts = await Cart.find({ user: user, is_ordered: false });
    const total = carts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (!address_id) {
        const uddd = {
            user: user, address: address, name: name, email: email, city: city, state: state, pincode: pincode
        }
        const uadd = await UserAddress.create(uddd)
        address_id = uadd._id;
    }



    await User.updateOne({ _id: user }, { name: name, email: email });

    const order_id = await generateOrderId();
    const order_date = new Date();
    const order = await new Order({ order_id, order_date, user, address_id, total });
    const porder = await order.save();
    carts.forEach(async cart => {
        await Cart.updateOne({ _id: cart._id }, { order: porder._id });
    });
    return res.json({
        data: order_id,
        message: "Order created successfully. Now pay online",
        errors: [],
        success: 1,
    });


}
const myaddresses = async (req, res) => {
    const user = req.user;
    const items = await UserAddress.find({ user: user });
    return res.json({
        errors: [],
        success: 1,
        data: items,
        message: "List of my address"
    });
}
const myorders = async (req, res) => {
    const user = req.user;
    const orders = await Cart.find({ user: user, is_ordered: true }).populate('product', 'title images url').populate('modal', 'title image').populate('brand', 'title image').sort({ createdAt: -1 });
    return res.json({
        errors: [],
        success: 1,
        data: orders,
        message: "List of my orders"
    });
}
const cart_by_product = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const fdata = { user: user, is_ordered: false, product: id }
    const items = await Cart.find(fdata);
    return res.json({
        errors: [],
        success: 1,
        data: items,
        message: "Cart by product"
    });
}

const apply_promo = async (req, res) => {
    const { promo_code } = req.body;
    const user = req.user;
    const fdata = {
        'promo_code': promo_code
    }
    const isValid = await PromoCode.findOne(fdata);
    if (!isValid) {
        return res.json({
            errors: [],
            success: 0,
            data: [],
            message: "Invalid Promo Code"
        });
    }
    const pid = isValid._id;
    const firstuse = await ApplyPromo.findOne({ user: user, promo_code: pid, order_placed: true });
    if (firstuse) {
        return res.json({
            errors: [],
            success: 0,
            data: [],
            message: "You have used this code"
        });
    }
    const carts = await Cart.find({ user: user, is_ordered: false });
    const total = carts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discount = 0;
    if (isValid.discount_type == "Percent") {
        const percent = isValid.discount;
        discount = total * percent * 0.01;
    } else {
        discount = isValid.discount;
    }
    const pdata = {
        user: user, promo_code: pid, order_placed: false, discount: discount
    }
    const npromo = await ApplyPromo.create(pdata);
    return res.json({
        errors: [],
        success: 0,
        data: npromo,
        discount: discount,
        message: "Code applied successfully"
    });


}
const add_to_wishlist = async (req, res) => {
    const { product, brand, modal } = req.body;
    const data = {
        user: req.user,
        product: product,
        brand: brand,
        modal: modal
    }
    await Wishlist.create(data).then((resp) => {
        return res.json({
            errors: [],
            success: 1,
            data: items,
            message: "Wishlist updated"
        });
    })
}
const get_wishlist = async (req, res) => {
    const user = req.user;
    const items = await Cart.find({ user: user });
    return res.json({
        errors: [],
        success: 1,
        data: items,
        message: "Wishlist fetched successfully"
    });
}
module.exports = {
    get_wishlist, add_to_wishlist, mycart, _create, get_all, mycarts, delete_cart, update_cart, checkout, myorders, apply_promo, cart_by_product, myaddresses
}