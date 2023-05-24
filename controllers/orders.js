import { Types } from 'mongoose';
import Order from '../models/Order';
import Products from '../models/Products';
import Cart from '../models/Cart';
import User from '../models/User';
import Notification from '../models/Notification';
import sendEmail from '../helpers/sendEmail';
import { placedOrderTemplate } from '../helpers/templates/userTemplate';
// import HttpError from '../helpers/errorsHandler/httpError';

/**
 * @exports
 * @class
 */
class Orders {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async makeOrder(req, res) {
    try {
      const { name, email, id } = req.user;
      const cart = await Cart.findOne({ user: Types.ObjectId(id) })
        .populate('items.product');
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          error: 'Your cart is empty',
        });
      }

      let totalAmount = 0;
      const ordersItems = [];
      const items = cart.items.map((item) => {
        const amount = item.product.price;
        const subTotal = amount * item.quantity;
        totalAmount += subTotal;
        const orderItem = Object.assign({}, {
          size: item.size,
          quantity: item.quantity,
          product: item.product._id,
          subTotal,
          amount,
        });
        ordersItems.push(Object.assign(orderItem, { product: item.product }));
        return orderItem;
      });

      const admin = await User.find({ isAdmin: true });
      const newOrder = new Order({
        user: req.user.id,
        items,
        totalAmount,
      });
      const order = await newOrder.save();
      admin.forEach(async () => {
        const newNotification = new Notification({
          user: id,
          message: `${req.user.name} has ordered for ${items.length}`,
          order: newOrder._id,
        });
        await newNotification.save();
        await sendEmail({ email: req.user.email, subject: 'Order', html: placedOrderTemplate({ name, totalAmount, items: ordersItems }) });
      });


      await cart.deleteOne();
      
      return res.status(201).json({
        message: 'successfully placed order',
        order
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'failed to make order, please try again later'
      });
    }
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async orderCustomShirt(req, res) {
    try {
      const { name, email, id } = req.user;
      const title = 'Custom shirt';
      const admin = await User.find({ isAdmin: true });
      let product = await Products.findOne({ title });

      if (!product) {
        product = new Products({
          title,
          user: admin[0] ? admin[0]._id : undefined,
        });
        await product.save();
      }
      const cart = await Cart.findOne({ user: Types.ObjectId(id) })
        .populate('items.product');
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          error: 'Your cart is empty',
        });
      }
    
      const newOrder = new Order({
        user: req.user.id,
        items: [{ product: product._id }],
      });

      const order = await newOrder.save();
      admin.forEach(async () => {
        const newNotification = new Notification({
          user: id,
          message: `${req.user.name} has ordered for ${title}`,
          order: newOrder._id,
        });
        await newNotification.save();
      });

      await sendEmail({ email, subject: 'Order', html: notificationTemplate('hhtt', name) });
      
      return res.status(201).json({
        message: 'successfully placed order',
        order
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'failed to make order, please try again later'
      });
    }
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getOrders(req, res) {
    try {
      const orders = await Order.find({ user: req.user.id })
        .populate('items.product');
      if (orders.length < 1) {
        return res.status(404).json({
          message: 'no orders found',
          orders: [],
        });
      }
      return res.status(200).json({
        message: 'successfully fetched purchase history',
        orders
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to get purchase history'
      });
    }
  }


  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async payOrder(req, res) {
    try {
      const { order } = req;

      order.paid = true;
      order.status = 'in-process';

      await order.save();

      return res.status(200).json({
        message: 'successfully paid your order',
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to get purchase history'
      });
    }
  }
}

export default Orders;
