import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Products' } }]
});

WishListSchema.index({ '$**': 'text' });
export default mongoose.model('WishList', WishListSchema);
