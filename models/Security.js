import mongoose from 'mongoose';

const { Schema } = mongoose;

const SecuritySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  number: {
    type: Number,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  }
});

export default mongoose.model('Security', SecuritySchema);
