import express from 'express';
import Profile from '../../controllers/profile';
import { isAuthenticated } from '../../middleware/auth';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';

const profile = new Profile();

const router = express.Router();

router.post('/', [isAuthenticated], asyncHandler(profile.createOrUpdateProfile));
router.get('/me', [isAuthenticated], asyncHandler(profile.currentUserProfile));

export default router;
