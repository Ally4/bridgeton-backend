import jwt from 'jsonwebtoken';
import WishList from '../models/WishList';
import 'dotenv/config';

const checkWishList = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const { productId } = req.params;
    const wishList = await WishList.find({ user: decoded.user.id })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price']);

    if (wishList.length < 1) {
      await new WishList({ user: decoded.user.id, items: [{ product: productId }] }).save();
      return res.status(201).json({ message: 'successfully added item to WishList' });
    } if (wishList.length > 0) {
      if (wishList[0].items.length < 1) {
        next();
      }
      wishList[0].items.forEach(async (element) => {
        if (element.product._id == productId) {
          return res.status(409).json({ error: 'item has already been added to WishList' });
        }
        next();
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to add product to wishList' });
  }
};

const filterWishList = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const wishList = await WishList.find({ user: decoded.user.id })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price']);
    let WishListSet = new Set();
    const filteredWishList = [];
    wishList[0].items.forEach((element) => {
      WishListSet.add(element.product._id);
    });
    WishListSet = Array.from(WishListSet);
    WishListSet.forEach((element) => {
      filteredWishList.push({ product: element });
    });
    await WishList.findByIdAndUpdate({ _id: wishList[0]._id }, { items: filteredWishList });
    next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to get items on the wishList' });
  }
};

export { checkWishList, filterWishList };
