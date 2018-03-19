"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.OrderSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    product: mongoose_1.Schema.Types.ObjectId,
    quantity: Number
});
exports.Order = mongoose_1.model("Order", exports.OrderSchema);
exports.default = exports.Order;
