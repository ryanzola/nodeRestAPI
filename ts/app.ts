import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'

import ProductsRouter from "./api/routes/products";
import OrderRouter from "./api/routes/orders";
import UserRouter from "./api/routes/user";


// create and configure an ExpressJS web server
class App {

  // reference to express instance 
  public express: express.Application

  // run configuration methods on express instance
  constructor() {
    this.express = express();
    this.middleware();
    this.routes()
  }

  // configure express middleware
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use('/uploads', express.static('uploads'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Accept, Authorization, Content-Type"
      );
    
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
      }
      next();
    });

    this.express.use((req, res, next) => {
      const error = new Error("Not found");
      next(error);
    });
    
    this.express.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
        error: {
          message: error.message
        }
      });
    });
  }

  private routes(): void {

    let router = express.Router();
    router.get('/', (req, res, next) => {
      res.json({
        message: 'hej welcome!'
      })
    })

    this.express.use('/', router);
    this.express.use('/products', ProductsRouter);
    this.express.use('/orders', OrderRouter);
    this.express.use('/user', UserRouter)
  }
}

export default new App().express;