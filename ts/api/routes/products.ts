import {Router, Request, Response, NextFunction} from 'express';
import * as multer from 'multer'
import checkAuth from '../middleware/check-auth'

const ProductsController = require("../controllers/products");
const Product = require("../models/product");

export class ProductsRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });

  fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  upload = multer({
    storage: this.storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: this.fileFilter
  });

  init() {
    this.router.get('/', ProductsController.products_get_all);
    this.router.post("/", checkAuth, this.upload.single("productImage"), ProductsController.products_create_product);
    this.router.get("/:productId", ProductsController.products_get_product);
    this.router.patch("/:productId", checkAuth, ProductsController.products_edit_product);
    this.router.delete("/:productId", checkAuth, ProductsController.products_delete_product);
  }
}

const productsRoutes = new ProductsRouter();
productsRoutes.init();
const router = productsRoutes.router;
export default router;
