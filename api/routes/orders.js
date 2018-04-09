import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import OrdersController from '../controllers/orders';

const router = Router();

router.get('/', checkAuth, OrdersController.orders_get_all);
router.post('/', checkAuth, OrdersController.orders_create_order);
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;