import express from 'express';
import ShoppingCart from '../../controllers/cart';
import { isAuthenticated } from '../../middleware/auth';
import { checkProduct, filterCart } from '../../middleware/checkCart';
import { checkProductFound } from '../../middleware/checkItem';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import { validateAddToCart, validations } from '../../middleware/validateAll';


const cart = new ShoppingCart();

const router = express.Router();

router.post(
  '/:productId',
  isAuthenticated,
  checkProductFound,
  checkProduct,
  [validateAddToCart, validations],
  asyncHandler(cart.addProductToCart)
);

router.get(
  '/',
  isAuthenticated,
  asyncHandler(cart.getCart)
);

router.delete(
  '/:productId',
  isAuthenticated,
  checkProductFound,
  filterCart,
  asyncHandler(cart.removeItemsFromCart)
);

export default router;
