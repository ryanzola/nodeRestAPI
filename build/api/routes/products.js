var express = require("express");
var router = express.Router();
var multer = require("multer");
var checkAuth = require("../middleware/check-auth");
var ProductsController = require("../controllers/products");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
var Product = require("../models/product");
router.get("/", ProductsController.products_get_all);
router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_create_product);
router.get("/:productId", ProductsController.products_get_product);
router.patch("/:productId", checkAuth, ProductsController.products_edit_product);
router.delete("/:productId", checkAuth, ProductsController.products_delete_product);
module.exports = router;
