/* eslint-disable import/prefer-default-export */
import { check, validationResult } from 'express-validator';
import User from '../models/User';
import httpError from '../helpers/errorsHandler/httpError';

const validateUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  const regexEmail = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i;
  const regexPwd = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  const regexName = /^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

  if (user) {
    throw new httpError(409, 'User already exists');
  }

  if (!name && !email && !password) {
    throw new httpError(400, 'name, email and password is required');
  }

  if (!regexName.test(name)) {
    throw new httpError(400, 'name should only contain letters and spaces e.g Mugerwa Joseph');
  }

  if (!regexEmail.test(email)) {
    throw new httpError(400, 'please provide a valid email e.g loan12@gmail.com');
  }

  if (!regexPwd.test(password)) {
    throw new httpError(400, 'a valid password should contain an uppercase, lowercase, number and a special character e.g Alphamugerwa12$');
  }

  next();
};

const validateDesign = async (req, res, next) => {
  const {
    frontColor,
    frontSize,
    frontText,
    frontTextColor,
    frontCanvas,
    backColor,
    backSize,
    backText,
    backTextColor,
    backCanvas
  } = req.body;
  if (!frontColor || !frontSize || !frontText || !frontTextColor || !frontCanvas
    || !backColor || !backSize || !backText || !backTextColor || !backCanvas) {
    return res.status(400).json({ error: 'frontColor, frontSize, frontText, frontTextColor, frontCanvas, backColor, backSize, backText, backTextColor, backCanvas is required' });
  }
  next();
};

const validateProfile = [
  check('country', 'country is required')
    .not()
    .isEmpty(),
  check('city', 'city is required')
    .not()
    .isEmpty(),

  // To be refactored
  // check('street', 'street is required')
  //   .not()
  //   .isEmpty(),
  // check('cardNumber', 'Wrong card number')
  //   .isCreditCard(),
  // check('expiryDate', 'expiryDate is required')
  //   .not()
  //   .isEmpty(),
  // check('cvv', 'cvv is required')
  //   .not()
  //   .isEmpty()
];
const validateUserLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required')
    .not()
    .isEmpty()
];
const validateCategory = [
  check('title', 'title is required')
    .not()
    .isEmpty(),
  check('description', 'description is required')
    .not()
    .isEmpty()
];

const validateProduct = [
  check('title', 'title is required')
    .not()
    .isEmpty(),
  check('description', 'description is required')
    .not()
    .isEmpty(),
  check('price', 'Price is required')
    .not()
    .isEmpty(),
];

const validatecorrection = [
  check('name', 'name is required')
    .not()
    .isEmpty(),
  check('description', 'description is required')
    .not()
    .isEmpty(),
  check('image', 'image is required')
    .not()
    .isEmpty()
];

const validatecorrectionUpdate = [
  check('name', 'name must be string'),
  check('description', 'description must be text'),
  check('image', 'image is string')
];

const validateAddToCart = [
  check('size', 'size is required')
    .not()
    .isEmpty(),
  check('quantity', 'quantity is required')
    .not()
    .isEmpty(),
];

const validations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export {
  validateUser,
  validations,
  validateUserLogin,
  validateProfile,
  validateCategory,
  validateProduct,
  validateDesign,
  validateAddToCart,
};
