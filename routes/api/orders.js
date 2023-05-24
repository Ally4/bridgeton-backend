import express from 'express';
import Order from '../../controllers/orders';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import { isAuthenticated } from '../../middleware/auth';
import checkOrder from '../../middleware/checkOrder';

const order = new Order();

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  asyncHandler(order.makeOrder)
);

router.post(
  '/customiser',
  isAuthenticated,
  asyncHandler(order.orderCustomShirt)
);

router.get(
  '/',
  isAuthenticated,
  order.getOrders
);

router.post(
  '/:orderId',
  isAuthenticated,
  checkOrder,
  order.payOrder
);

export default router;
