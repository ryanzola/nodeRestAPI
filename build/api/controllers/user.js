var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var User = require("../models/user");
exports.user_signup = function (req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(function (user) {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "this user already exists"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    var user_1 = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user_1
                        .save()
                        .then(function (result) {
                        console.log(result);
                        res.status(201).json({
                            message: "user created"
                        });
                    })
                        .catch(function (err) {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
};
exports.user_login = function (req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(function (user) {
        if (user.length < 1) {
            res.status(401).json({
                message: "authentication failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, function (err, result) {
            if (err) {
                return res.status(401).json({
                    message: "authentication failed"
                });
            }
            if (result) {
                var token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1hr"
                });
                return res.status(200).json({
                    message: "authentication successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "authentication failed"
            });
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
exports.user_delete = function (req, res, next) {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(function (result) {
        res.status(200).json({
            message: "user deleted"
        });
    })
        .catch(function (err) {
        res.status(500).json({
            error: err
        });
    });
};
