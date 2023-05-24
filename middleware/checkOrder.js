import { Types } from 'mongoose';
import Order from '../models/Order';
import 'dotenv/config';

const checkOrder = async (req, res, next) => {
  try {
    const { user } = req;
    const { orderId } = req.params;
    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      user: new Types.ObjectId(user.id),
    });

    if (!order) {
      return res.status(400).json({ error: "order doesn't exis" });
    }

    req.order = order;
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to verify your order' });
  }
};


export default checkOrder;
