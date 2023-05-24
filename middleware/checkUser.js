/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import User from '../models/User';
import httpError from '../helpers/errorsHandler/httpError';

const checkUserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new httpError(400, 'wrong username or password');
  }
  if (user.isDeactivated === true) {
    return res.status(403).json({ error: 'sorry your account has been deactivated' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new httpError(400, 'wrong username or password');
  }
  next();
};

const checkUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'failed to find user' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'failed to find user' });
  }
};

export { checkUserLogin, checkUserId };
