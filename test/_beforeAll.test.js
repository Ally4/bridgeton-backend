/* eslint-disable import/prefer-default-export */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../models/User';
import Cart from '../models/Cart';
import Profile from '../models/Profile';
import Category from '../models/Category';
import Products from '../models/Products';
import {
  existingUser, loginUser, normalUser, isNotTheOwner
} from '../testingData/user.json';
import Order from '../models/Order';
import Designs from '../models/Designs';

let tokenToUse;
let res;

chai.use(chaiHttp);
chai.should();

const beforeFunc = async () => {
  await Profile.deleteMany({});
  await User.deleteMany({});
  await Category.deleteMany({});
  await Cart.deleteMany({});
  await Products.deleteMany({});
  await Order.deleteMany({});
  await Designs.deleteMany({});
  await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(existingUser);

  await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(normalUser);

  await chai
    .request(app)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .send(isNotTheOwner);

  res = await chai
    .request(app)
    .post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send(loginUser);

  tokenToUse = res.body.token;
  return tokenToUse;
};

export { beforeFunc };
