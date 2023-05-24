/* eslint-disable require-jsdoc */

import jwt from 'jsonwebtoken';
import WishList from '../models/WishList';
import 'dotenv/config';

class WishListController {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async addProductToWishList(req, res) {
    try {
      const token = req.header('auth-token');
      const decoded = jwt.verify(token, process.env.jwtSecret);
      const { productId } = req.params;
      const wishList = await WishList.find({ user: decoded.user.id })
        .populate('user', ['name', 'avatar'])
        .populate('items.product', ['title', 'description', 'image', 'price']);
      const wishListCollection = wishList[0].items;
      wishListCollection.push({ product: productId });
      await WishList.findByIdAndUpdate({ _id: wishList[0]._id }, { items: wishListCollection });
      return res.status(201).json({ message: 'successfully added item to wishList' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'failed to add product to wish list' });
    }
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getWishList(req, res) {
    try {
      const token = req.header('auth-token');
      const decoded = jwt.verify(token, process.env.jwtSecret);
      const wishList = await WishList.find({ user: decoded.user.id })
        .populate('user', ['name', 'avatar'])
        .populate('items.product', ['title', 'description', 'image', 'price', 'category']);
      if (wishList[0].items.length < 1) {
        return res.status(404).json({ message: 'no items found on wish list' });
      }
      return res.status(200).json({ wishList, message: 'successfully fetched items on wish list' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to get items on the shopping WishList' });
    }
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async removeItemsFromWishList(req, res) {
    try {
      const token = req.header('auth-token');
      const decoded = jwt.verify(token, process.env.jwtSecret);
      const { productId } = req.params;
      const wishList = await WishList.find({ user: decoded.user.id })
        .populate('items.product', ['id']);
      console.log(wishList[0].items);
      if (wishList[0].items.length < 1) {
        return res.status(404).json({ message: 'no items found on wish list' });
      }
      const wishListCollection = wishList[0].items;
      const newWishListCollection = [];
      wishListCollection.forEach((element) => {
        // eslint-disable-next-line eqeqeq
        if (element.product._id != productId) {
          newWishListCollection.push({ product: element.product._id });
        }
      });
      await WishList.findByIdAndUpdate({ _id: wishList[0]._id }, { items: newWishListCollection });
      return res.status(204).json({ wishList, message: 'successfully removed item from WishList' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to get items on the wish list' });
    }
  }
}

export default WishListController;
