import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  auth: {
    type: String,
    default: 'manual'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeactivated: {
    type: Boolean,
    default: false,
    required: true
  },
  alternativeEmail: {
    type: String
  },
  currency: {
    type: String,
    required: true,
    default: 'rwf'
  },
  language: {
    type: String,
    required: true,
    default: 'english'
  }
});

UserSchema.plugin(mongoosePaginate);

export default mongoose.model('User', UserSchema);
