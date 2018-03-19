import {Router, Request, Response, NextFunction} from 'express';
import checkAuth from '../middleware/check-auth'

import OrdersController from '../controllers/orders';

export class OrdersRouter {
  router: Router;
  ordersController: OrdersController;

  constructor() {
    this.router = Router();
    this.ordersController = new OrdersController()
    this.init()
  }

  init() {
    this.router.get('/', checkAuth, this.ordersController.orders_get_all);
    this.router.post('/', checkAuth, this.ordersController.orders_create_order);
    this.router.get('/:orderId', checkAuth, this.ordersController.orders_get_order);
    this.router.delete('/:orderId', checkAuth, this.ordersController.orders_delete_order);
  }
}

export const orderRoutes = new OrdersRouter();
orderRoutes.init();
const router = orderRoutes.router;
export default router;
