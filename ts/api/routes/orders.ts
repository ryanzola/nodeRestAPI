import {Router, Request, Response, NextFunction} from 'express';
import checkAuth from '../middleware/check-auth'

const OrdersController = require("../controllers/orders");

export class OrdersRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init()
  }

  init() {
    this.router.get('/', checkAuth, OrdersController.orders_get_all);
    this.router.post('/', checkAuth, OrdersController.orders_create_order);
    this.router.get('/:orderId', checkAuth, OrdersController.orders_get_order);
    this.router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);
  }
}

export const orderRoutes = new OrdersRouter();
orderRoutes.init();
const router = orderRoutes.router;
export default router;
