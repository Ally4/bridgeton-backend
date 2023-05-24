import mongoose from 'mongoose';

const { Schema } = mongoose;

const DesignSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  frontColor: {
    type: String,
    required: true
  },
  frontSize: {
    type: String,
    required: true
  },
  frontCanvas: {
    type: String,
    required: true
  },
  backText: {
    type: String,
    required: true
  },
  backSize: {
    type: String,
    required: true
  },
  backColor: {
    type: String,
    required: true
  },
  backTextColor: {
    type: String,
    required: true
  },
  frontTextColor: {
    type: String,
    required: true
  },
  frontText: {
    type: String,
    required: true
  },
  backCanvas: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

DesignSchema.index({ '$**': 'text' });
export default mongoose.model('Design', DesignSchema);
