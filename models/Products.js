import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const ProductsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  frontImage: {
    type: String,
    default: null
  },
  backImage: {
    type: String,
    default: null,
  },
  image: {
    type: String
  },
  images: [
    {
      type: String
    },
  ],
  price: {
    type: Number,
    required: true
  },
  designer: {
    type: Schema.Types.ObjectId,
    ref: 'Designer',
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ProductsSchema.plugin(mongoosePaginate);

ProductsSchema.index({ '$**': 'text' });

export default mongoose.model('Products', ProductsSchema);
