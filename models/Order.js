import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      size: {
        type: String,
        default: 'M',
      },
      quantity: {
        type: Number,
        default: 1,
      },
      product: { type: Schema.Types.ObjectId, ref: 'Products' },
      amount: {
        type: Number,
        default: 0.0,
        required: true,
      },
      subTotal: {
        type: Number,
        default: 0.0,
        required: true,
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0.0,
    required: true,
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'pending',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', OrderSchema);
