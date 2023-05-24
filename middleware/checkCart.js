import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import Cart from '../models/Cart';
import 'dotenv/config';

const checkProduct = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const { productId } = req.params;
    const { quantity, size } = req.body;
    let cart = await Cart.findOne({ user: new Types.ObjectId(decoded.user.id) })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price']);

    if (!cart) {
      cart = new Cart({
        user: decoded.user.id,
        items: [{ quantity, size, product: productId }]
      });

      cart.save();

      return res.status(201).json({ cart, message: 'successfully added item to cart' });
    }

    if (cart.items.length === 0) {
      return next();
    }

    const foundIndex = cart.items.findIndex(item => item.product._id.equals(productId));

    if (foundIndex !== -1) {
      cart.items[foundIndex].quantity = quantity;
      await cart.save();

      return res.status(200).json({ cart, message: 'item quantity updated' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to add product to cart' });
  }
};

const filterCart = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const cart = await Cart.find({ user: decoded.user.id })
      .populate('user', ['name', 'avatar'])
      .populate('items.product', ['title', 'description', 'image', 'price']);
    let cartSet = new Set();
    const filteredCart = [];
    cart[0].items.forEach((element) => {
      cartSet.add(element.product._id);
    });
    cartSet = Array.from(cartSet);
    cartSet.forEach((element) => {
      filteredCart.push({ product: element });
    });
    await Cart.findByIdAndUpdate({ _id: cart[0]._id }, { items: filteredCart });
    next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to get items on the shopping cart' });
  }
};

export { checkProduct, filterCart };
