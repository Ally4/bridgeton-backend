/* istanbul ignore file */
import jwt from 'jsonwebtoken';
import User from '../models/User';
import generateToken from '../helpers/generateToken';
import verifyUserTemplate from '../helpers/templates/userTemplate';
import 'dotenv/config';
import sendEmail from '../helpers/sendEmail';

const verifyAccount = async (req, res, next) => {
  const { email } = req.body;
  const { token } = req.query;
  if (token) {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    if (decoded.isVerified) {
      await User.findOneAndUpdate({ email }, { isVerified: true });
    }
  }
  next();
};

const sendVerificationEmail = async (email, payload) => {
  const { name } = payload.user;
  const token = generateToken({ email, isVerified: true });
  await sendEmail({
    email,
    subject: 'Bridgeton User Verification',
    text: 'Bridgeton loging in',
    html: verifyUserTemplate(`${process.env.FRONTEND_APP_URL}/verify?token=${token}`, name)
  });
};

export { verifyAccount, sendVerificationEmail };
