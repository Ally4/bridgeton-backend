/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import httpError from '../helpers/errorsHandler/httpError';
import Category from '../models/Category';
import Products from '../models/Products';
import Orders from '../models/Order';
import Design from '../models/Designs';
import Corrections from '../models/corrections'
import Designers from '../models/designers'

const checkCategoryAccess = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (category.user.toString() !== req.user.id) {
    throw new httpError(401, 'Action denied');
  }
  next();
};
const checkProductAccess = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Products.findById(productId);
  if (product.user.toString() !== req.user.id) {
    throw new httpError(
      401,
      'Action denied, you are not the owner of this product'
    );
  }
  next();
};
const checkProductFound = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Products.findById(productId);
  if (!product) {
    throw new httpError(404, 'product not found, try again later');
  }
  next();
};

export const checkCorrectionFound = async (req, res, next) => {
  const { correctionId } = req.params;
  const correction = await Corrections.findById(correctionId);
  if (!correction) {
    throw new httpError(404, 'Collection not found, try again later');
  }
  next();
};

export const checkDesignerFound = async (req, res, next) => {
  const { designerId } = req.params;
  const designer = await Designers.findById(designerId);
  if (!designer) {
    throw new httpError(404, 'Designer not found, try again later');
  }
  next();
};

const checkDesign = async (req, res, next) => {
  const { designId } = req.params;
  const designs = await Design.findById(designId);
  if (!designs) {
    return res.status(404).json({
      message: 'no design found'
    });
  }
  next();
};
const checkOrder = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id } = req.user;
    const order = await Orders.findOne({ product: productId, status: 'pending', user: id });
    if (order) {
      return res.status(409).json({ error: 'wait for confirmation of this order before you can make another one' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to make order, try again later' });
  }
};

export {
  checkCategoryAccess, checkProductAccess, checkProductFound, checkOrder, checkDesign
};
