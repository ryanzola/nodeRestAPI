import {Router, Request, Response, NextFunction} from 'express';
import * as multer from 'multer'

import ProductsController from '../controllers/products';
import { Product } from '../models/product';

export class ProductsRouter {
  router: Router;
  productsController: ProductsController;

  constructor() {
    this.router = Router();
    this.productsController = new ProductsController();
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
    this.router.get('/', this.productsController.products_get_all);
    this.router.post("/", this.upload.single("productImage"), this.productsController.products_create_product);
    this.router.get("/:productId", this.productsController.products_get_product);
    this.router.patch("/:productId", this.productsController.products_edit_product);
    this.router.delete("/:productId", this.productsController.products_delete_product);
  }
}

const productsRoutes = new ProductsRouter();
productsRoutes.init();
const router = productsRoutes.router;
export default router;
