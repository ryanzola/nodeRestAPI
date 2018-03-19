"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_auth_1 = require("../middleware/check-auth");
const orders_1 = require("../controllers/orders");
class OrdersRouter {
    constructor() {
        this.router = express_1.Router();
        this.ordersController = new orders_1.default();
        this.init();
    }
    init() {
        this.router.get('/', check_auth_1.default, this.ordersController.orders_get_all);
        this.router.post('/', check_auth_1.default, this.ordersController.orders_create_order);
        this.router.get('/:orderId', check_auth_1.default, this.ordersController.orders_get_order);
        this.router.delete('/:orderId', check_auth_1.default, this.ordersController.orders_delete_order);
    }
}
exports.OrdersRouter = OrdersRouter;
exports.orderRoutes = new OrdersRouter();
exports.orderRoutes.init();
const router = exports.orderRoutes.router;
exports.default = router;
