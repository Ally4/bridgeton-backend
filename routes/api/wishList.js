import express from 'express';
import wishList from '../../controllers/wishList';
import { isAuthenticated } from '../../middleware/auth';
import { checkWishList, filterWishList } from '../../middleware/checkWishList';
import { checkProductFound } from '../../middleware/checkItem';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';

const WishList = new wishList();

const router = express.Router();

router.post(
  '/:productId',
  isAuthenticated,
  checkProductFound,
  checkWishList,
  asyncHandler(WishList.addProductToWishList)
);

router.get(
  '/',
  isAuthenticated,
  filterWishList,
  asyncHandler(WishList.getWishList)
);

router.delete(
  '/:productId',
  isAuthenticated,
  checkProductFound,
  filterWishList,
  asyncHandler(WishList.removeItemsFromWishList)
);

export default router;
