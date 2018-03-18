import { NextFunction, Request, Response, Router } from 'express';
import * as mongoose from 'mongoose'

import { Product } from '../models/product';

interface IProductReq extends Request {
  file: {
    path: string
  }
}

export default class ProductController {
  constructor() {}

  products_get_all(req: Request, res: Response, next: NextFunction) {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            url: {
              request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
              }
            }
          };
        })
      };
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  };

  products_create_product(req: IProductReq, res: Response, next: NextFunction) {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'product created',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: "http://localhost:3000/products/" + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
  }

  products_get_product(req: Request, res: Response, next: NextFunction) {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log(doc);
      if(doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'no valid entry found for the provided ID'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  }

  products_edit_product(req: Request, res: Response, next: NextFunction) {
    const id = req.params.productId;
    const updateOps = {}
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'product successfully updated',
        request: {
          type: 'GET',
          url: "http//localhost:3000/products" + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  }

  products_delete_product(req: Request, res: Response, next: NextFunction) {
    const id = req.params.productId;
    Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'product successfully deleted'
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
}
