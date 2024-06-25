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
    const data = [...req.body];
    data.forEach(async dta => {
        const newCartEntry = await Cart.create(dta);
        console.log(newCartEntry)
    })



    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry created successfully",
        data: []
    });
}


module.exports = {
    _create
}