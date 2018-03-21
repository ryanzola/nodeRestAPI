"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controllers/orders");
class OrdersRouter {
    constructor() {
        this.router = express_1.Router();
        this.ordersController = new orders_1.default();
        this.init();
    }
    init() {
        this.router.get('/', this.ordersController.orders_get_all);
        this.router.post('/', this.ordersController.orders_create_order);
        this.router.get('/:orderId', this.ordersController.orders_get_order);
        this.router.delete('/:orderId', this.ordersController.orders_delete_order);
    }
}
exports.OrdersRouter = OrdersRouter;
exports.orderRoutes = new OrdersRouter();
exports.orderRoutes.init();
const router = exports.orderRoutes.router;
exports.default = router;
