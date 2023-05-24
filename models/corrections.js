import mongoose from 'mongoose';

const { Schema } = mongoose;

const AllcorrectionsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

AllcorrectionsSchema.index({ '$**': 'text' });
export default mongoose.model('Corrections', AllcorrectionsSchema);
