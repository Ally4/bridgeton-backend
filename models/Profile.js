import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProfileSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String
  },
  bio: {
    type: String,
  },
  paymentInfo: {
    cardNumber: {
      type: String
    },
    expiryDate: {
      type: Date
    },
    cvv: {
      type: String
    },
    telephone: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  houseNumber: {
    type: String,
  },
  zipcode: {
    type: String
  },
  landmark: {
    type: String
  },
  googleMapLink: {
    type: String,
  },
  billingAddress: {
    type: String,
  }
});

export default mongoose.model('Profile', ProfileSchema);
