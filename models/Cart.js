import mongoose from 'mongoose';

const { Schema } = mongoose;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
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
    }
  ]
});

CartSchema.index({ '$**': 'text' });
export default mongoose.model('Cart', CartSchema);
