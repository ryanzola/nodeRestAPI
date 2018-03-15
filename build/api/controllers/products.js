var mongoose = require("mongoose");
var Product = require("../models/product");
exports.products_get_all = function (req, res, next) {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(function (docs) {
        var response = {
            count: docs.length,
            products: docs.map(function (doc) {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    url: {
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                };
            })
        };
        res.status(200).json(response);
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).json(err);
    });
};
exports.products_create_product = function (req, res, next) {
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(function (result) {
        console.log(result);
        res.status(201).json({
            message: "created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.products_get_product = function (req, res, next) {
    var id = req.params.productId;
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(function (doc) {
        console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({
                message: "no valid entry found for provided ID"
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.products_edit_product = function (req, res, next) {
    var id = req.params.productId;
    var updateOps = {};
    for (var _i = 0, _a = req.body; _i < _a.length; _i++) {
        var ops = _a[_i];
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(function (result) {
        console.log(result);
        res.status(200).json({
            message: "product successfully updated",
            request: {
                type: "GET",
                url: "http//localhost:3000/products" + id
            }
        });
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).json(err);
    });
};
exports.products_delete_product = function (req, res, next) {
    var id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(function (result) {
        res.status(200).json({
            message: "product successfully deleted"
        });
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).json(err);
    });
};
