/* eslint-disable import/prefer-default-export */
import User from '../models/User';
import httpError from '../helpers/errorsHandler/httpError';

const checkAdmin = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user.isAdmin) {
    throw new httpError(403, 'you are forbidden from accessing this resource');
  }
  next();
};

const checkSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isSuperAdmin === false) {
      return res.status(403).json({ error: 'you are forbidden from accessing this resource' });
    }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'you are forbidden from accessing this resource' });
  }
};

export { checkAdmin, checkSuperAdmin };
