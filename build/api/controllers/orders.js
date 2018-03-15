var mongoose = require("mongoose");
var Order = require("../models/order");
var Product = require("../models/product");
exports.orders_get_all = function (req, res, next) {
    Order.find()
        .select("product quantity _id")
        .exec()
        .then(function (docs) {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(function (doc) {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
                    }
                };
            })
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
exports.orders_create_order = function (req, res, next) {
    Product.findById(req.body.productId)
        .then(function (product) {
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            });
        }
        var order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
        .then(function (result) {
        res.status(201).json({
            message: "order was successfully created",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id
            }
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
exports.orders_get_order = function (req, res, next) {
    Order.findById(req.params.orderId)
        .exec()
        .then(function (order) {
        if (!order) {
            return res.status(404).json({
                message: "order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders"
            }
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
exports.orders_delete_order = function (req, res, next) {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(function (result) {
        res.status(200).json({
            message: "order was successfully deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: { productId: "ID", quantity: "Number" }
            }
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
