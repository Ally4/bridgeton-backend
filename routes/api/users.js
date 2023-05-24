import express from 'express';
import Users from '../../controllers/users';
import Securities from '../../controllers/security';
import passport from '../../middleware/strategies';
import {
  validateUser,
  validations,
  validateUserLogin
} from '../../middleware/validateAll';
import { isAdmin, checkSuperAdmin } from '../../middleware/isAdmin';
import { checkUserLogin, checkUserId } from '../../middleware/checkUser';
import { upload, imageValidation } from '../../helpers/imageUpload';
import { verifyAccount } from '../../middleware/verifyUser';
import { isAuthenticated } from '../../middleware/auth';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';

const users = new Users();
const securities = new Securities();

const router = express.Router();

router.post(
  '/',
  upload.single('image'),
  imageValidation,
  asyncHandler(validateUser),
  asyncHandler(users.signup)
);

router.get(
  '/',
  isAuthenticated,
  checkSuperAdmin,
  asyncHandler(users.getUsers)
);

router.post(
  '/login',
  validateUserLogin,
  verifyAccount,
  asyncHandler(checkUserLogin),
  validations,
  asyncHandler(users.login)
);
router.get(
  '/questions',
  asyncHandler(securities.getSecurityQuestions)
);
router.post(
  '/questions',
  isAuthenticated,
  asyncHandler(securities.createSecurity)
);
router.put(
  '/questions/:securityId',
  isAuthenticated,
  asyncHandler(securities.updateSecurityQuestion)
);
router.post(
  '/password-link',
  asyncHandler(users.passwordResetEmail)
);
router.post(
  '/reset-password',
  asyncHandler(users.resetPassword)
);
router.post(
  '/activate-account',
  asyncHandler(users.activateUserAccount)
);
router.patch(
  '/change-currency',
  isAuthenticated,
  asyncHandler(users.changeCurrency)
);
router.patch(
  '/change-language',
  isAuthenticated,
  asyncHandler(users.changeLanguage)
);
router.patch(
  '/:userId/admin/make',
  isAuthenticated,
  checkSuperAdmin,
  checkUserId,
  asyncHandler(users.createAdmin)
);
router.patch(
  '/:userId/admin/revoke',
  isAuthenticated,
  checkSuperAdmin,
  checkUserId,
  asyncHandler(users.revokeAdmin)
);
router.patch(
  '/:userId/deactivate',
  isAuthenticated,
  checkSuperAdmin,
  checkUserId,
  asyncHandler(users.deactivateUser)
);
router.patch(
  '/:userId/activate',
  isAuthenticated,
  checkSuperAdmin,
  checkUserId,
  asyncHandler(users.activateUser)
);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google'), users.google);
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook'), users.google);

export default router;
