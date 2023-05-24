import express from 'express';
import {celebrate} from 'celebrate'
import Designers from '../../../controllers/designers';
import {
    isAuthenticated
} from '../../../middleware/auth';
import asyncHandler from '../../../helpers/errorsHandler/asyncHandler';
import {
    checkAdmin
} from '../../../middleware/isAdmin';
import {
    validate,
    validateParam,
} from './designers.validation'
import {
    checkDesignerFound
} from '../../../middleware/checkItem';

const designers = new Designers();
const router = express.Router();

/**
 * retrieve and create designers
 */
router
    .route('/')
    .post(celebrate({
        body: validate
    }), isAuthenticated, asyncHandler(checkAdmin), asyncHandler(designers.createDesigner))
    .get(asyncHandler(designers.getDesigners))

/**
 * retrieve, delete and update designers
 */
router
    .route('/:designerId')
    .all(asyncHandler(checkDesignerFound))
    .get(asyncHandler(designers.getOneDesigner))
    .put(asyncHandler(designers.updateDesigner))

/**
 * Designer products
 */
router
.route('/products/:designerId')
.all(celebrate({ params: validateParam }))
.get(asyncHandler(designers.designerProducts))


export default router;