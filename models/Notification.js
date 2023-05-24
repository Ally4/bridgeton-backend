import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

NotificationSchema.index({ '$**': 'text' });
export default mongoose.model('Notification', NotificationSchema);
