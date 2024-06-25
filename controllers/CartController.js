const _create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            errors: errors.array(),
            success: 0,
            message: "Errors occured",
            data: []
        });
    }
    const data = { ...req.bdoy };
    const newCartEntry = await Cart.create(data);

    return res.json({
        errors: [],
        success: 1,
        message: "Cart entry created successfully",
        data: newCartEntry
    });
}


module.exports = {
    _create
}