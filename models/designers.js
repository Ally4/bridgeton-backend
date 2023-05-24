import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const DesignersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    dropDups: true,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: "Rwanda"
  },
  description: {
    type: String,
    required: true,
  }
});

DesignersSchema.plugin(mongoosePaginate);

DesignersSchema.index({ '$**': 'text' });

export default mongoose.model('Designer', DesignersSchema);
