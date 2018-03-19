"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
exports.userSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }
});
exports.userSchema.method('comparePassword', function (password) {
    if (bcrypt.compareSync(password, this.password))
        return true;
    return false;
});
exports.userSchema.method('hashPassword', function (password) {
    return bcrypt.hashSync(password, 10);
});
exports.User = mongoose_1.model('User', exports.userSchema);
exports.default = exports.User;
