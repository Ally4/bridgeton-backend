import express from 'express';
import Designs from '../../controllers/design';
import { validateDesign } from '../../middleware/validateAll';
import { isAuthenticated } from '../../middleware/auth';
import { checkDesign } from '../../middleware/checkItem';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validateDesign,
  Designs.createDesign
);
router.get(
  '/',
  isAuthenticated,
  Designs.getDesigns
);
router.get(
  '/:designId',
  isAuthenticated,
  checkDesign,
  Designs.getDesign
);
router.put(
  '/:designId',
  isAuthenticated,
  validateDesign,
  checkDesign,
  Designs.updateDesign
);
router.delete(
  '/:designId',
  isAuthenticated,
  checkDesign,
  Designs.deleteDesign
);

export default router;
