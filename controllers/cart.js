/* eslint-disable require-jsdoc */

import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import Cart from '../models/Cart';
import 'dotenv/config';

class ShoppingCart {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async addProductToCart(req, res) {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const { productId } = req.params;
    const { size, quantity } = req.body;

    const cart = await Cart.findOne({ user: Types.ObjectId(decoded.user.id) })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price']);

    cart.items.push({ product: productId, size, quantity });

    await cart.save();

    return res.status(201).json({
      cart, size, quantity, message: 'successfully added item to cart'
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getCart(req, res) {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const cart = await Cart.findOne({ user: new Types.ObjectId(decoded.user.id) })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price', 'category']);

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'no items found in cart' });
    }

    return res.status(200).json({ cart, message: 'successfully fetched items' });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async removeItemsFromCart(req, res) {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const { productId } = req.params;
    const cart = await Cart.find({ user: decoded.user.id })
      .populate('items.product', ['id']);
    if (cart[0].items.length < 1) {
      return res.status(404).json({ message: 'no items found in cart' });
    }
    const cartCollection = cart[0].items;
    const newCartCollection = [];
    cartCollection.forEach((element) => {
      // eslint-disable-next-line eqeqeq
      if (element.product._id != productId) {
        newCartCollection.push({ product: element.product._id });
      }
    });
    await Cart.findByIdAndUpdate({ _id: cart[0]._id }, { items: newCartCollection });
    return res.status(204).json({ cart, message: 'successfully removed item from cart' });
  }
}

export default ShoppingCart;
