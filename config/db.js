import mongoose from 'mongoose';
import 'dotenv/config';

const db = {
  test: process.env.mongoURI_TEST,
  development: process.env.mongoURI_DEV,
  production: process.env.MONGODB_URI,
};

const url = db[process.env.NODE_ENV];

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('Mongodb connected');
  } catch (err) {
    console.log('Mongodb failed to connect', err);
  }
};

export default connectDB;
