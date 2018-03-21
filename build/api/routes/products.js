"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const products_1 = require("../controllers/products");
class ProductsRouter {
    constructor() {
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./uploads/");
            },
            filename: function (req, file, cb) {
                cb(null, new Date().toISOString() + file.originalname);
            }
        });
        this.fileFilter = (req, file, cb) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        };
        this.upload = multer({
            storage: this.storage,
            limits: {
                fileSize: 1024 * 1024 * 5
            },
            fileFilter: this.fileFilter
        });
        this.router = express_1.Router();
        this.productsController = new products_1.default();
        this.init();
    }
    init() {
        this.router.get('/', this.productsController.products_get_all);
        this.router.post("/", this.upload.single("productImage"), this.productsController.products_create_product);
        this.router.get("/:productId", this.productsController.products_get_product);
        this.router.patch("/:productId", this.productsController.products_edit_product);
        this.router.delete("/:productId", this.productsController.products_delete_product);
    }
}
exports.ProductsRouter = ProductsRouter;
const productsRoutes = new ProductsRouter();
productsRoutes.init();
const router = productsRoutes.router;
exports.default = router;
