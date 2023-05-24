import express from 'express';
import Products from '../../controllers/product';
import { validateProduct, validations } from '../../middleware/validateAll';
import { isAuthenticated } from '../../middleware/auth';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import { checkAdmin } from '../../middleware/isAdmin';
import { upload, imageValidation } from '../../helpers/imageUpload';
import { checkProductAccess, checkProductFound } from '../../middleware/checkItem';

const products = new Products();
const router = express.Router();

router.post(
  '/:categoryId',
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  [isAuthenticated, asyncHandler(checkAdmin), validateProduct, validations],
  asyncHandler(products.createProducts)
);
router.get('/', asyncHandler(products.getProducts));
router.get(
  '/:productId',
  asyncHandler(checkProductFound),
  asyncHandler(products.getOneProduct)
);
router.get(
  '/category/:categoryId',
  products.getProductsByCategory
);
router.put(
  '/:productId',
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  [
    isAuthenticated,
    asyncHandler(checkAdmin),
    validateProduct,
    validations,
    asyncHandler(checkProductFound),
    imageValidation,
    asyncHandler(checkProductAccess)
  ],
  asyncHandler(products.updateProduct)
);
router.delete(
  '/:productId',
  [
    isAuthenticated,
    asyncHandler(checkAdmin),
    asyncHandler(checkProductFound),
    asyncHandler(checkProductAccess)
  ],
  asyncHandler(products.deleteOneProduct)
);

export default router;
