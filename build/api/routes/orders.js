var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/check-auth");
var OrdersController = require("../controllers/orders");
router.get("/", checkAuth, OrdersController.orders_get_all);
router.post("/", checkAuth, OrdersController.orders_create_order);
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);
module.exports = router;
