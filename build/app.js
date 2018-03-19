"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const products_1 = require("./api/routes/products");
const orders_1 = require("./api/routes/orders");
const user_1 = require("./api/routes/user");
// create and configure an ExpressJS web server
class App {
    // run configuration methods on express instance
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // configure express middleware
    middleware() {
        this.express.use(logger('dev'));
        this.express.use('/uploads', express.static('uploads'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Authorization, Content-Type");
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
    routes() {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'hej welcome!'
            });
        });
        this.express.use('/', router);
        this.express.use('/products', products_1.default);
        this.express.use('/orders', orders_1.default);
        this.express.use('/user', user_1.default);
    }
}
exports.default = new App().express;
