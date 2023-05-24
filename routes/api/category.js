import express from 'express';
import Category from '../../controllers/category';
import { validateCategory, validations } from '../../middleware/validateAll';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import { checkAdmin } from '../../middleware/isAdmin';
import { upload, imageValidation } from '../../helpers/imageUpload'; 
import { checkCategoryAccess } from '../../middleware/checkItem';
import { isAuthenticated } from '../../middleware/auth';

const category = new Category();

const router = express.Router();

router.post(
  '/',
  asyncHandler(isAuthenticated),
  [asyncHandler(checkAdmin), validateCategory, validations],
  upload.single('image'),
  imageValidation,
  asyncHandler(category.createCategory)
);
router.get('/', asyncHandler(category.getCategories));
router.get('/:categoryId', asyncHandler(category.getOneCategory));
router.put(
  '/:categoryId',
  [
    isAuthenticated,
    asyncHandler(checkCategoryAccess),
    asyncHandler(checkAdmin),
    validateCategory,
    validations
  ],
  upload.single('image'),
  imageValidation,
  asyncHandler(category.updateCategory)
);
router.delete(
  '/:categoryId',
  [isAuthenticated, asyncHandler(checkCategoryAccess), asyncHandler(checkAdmin)],
  asyncHandler(category.deleteOneCategory)
);
export default router;
