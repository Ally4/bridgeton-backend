import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const ProductcorrectionsSchema = new Schema({
  correctionId: {
    type: Schema.Types.ObjectId,
    ref: 'Corrections'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ProductcorrectionsSchema.plugin(mongoosePaginate);

ProductcorrectionsSchema.index({ '$**': 'text' });

export default mongoose.model('Productscorrections', ProductcorrectionsSchema);
