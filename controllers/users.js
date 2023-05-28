import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import generateToken from '../helpers/generateToken';
import { sendVerificationEmail } from '../middleware/verifyUser';
import httpError from '../helpers/errorsHandler/httpError';
import { sendResetPasswordEmail, generateHarsh } from '../middleware/auth';
import sendEmail from '../helpers/sendEmail';
import notificationTemplate from '../helpers/templates/userTemplate';
import 'dotenv/config';
import formatPaginationResponse from '../helpers/formatPaginationResponse';

/**
 * @user Controller
 * @exports
 * @class
 */
class UserController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async signup(req, res) {
    const {
      name, email, password, isAdmin
    } = req.body;

    const avatar = gravatar.url(name, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });

    const user = new User({
      name,
      email,
      avatar: req.file ? req.file.location : avatar,
      password,
      isAdmin,
    });

    user.password = generateHarsh(password);
    await user.save();
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        language: user.language
      }
    };
    const registeredUser = await User.findById(user.id).select('-password');

    const token = generateToken(payload);
    // sendVerificationEmail(email, payload);
    res.status(201).json({
      status: 201, registeredUser, token, message: 'A verification email has been sent to your email'
    });
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async login(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email }, { password: 0 });
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        currency: user.currency,
        language: user.language
      }
    };
    console.log("this is shit");
    const token = generateToken(payload);
    return res.status(200).json({ status: 200, user, token });
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async resetPassword(req, res) {
    const { password } = req.body;
    const regexPwd = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
    if (!password || password === '' || regexPwd.test(password) === false) {
      throw new httpError(
        400,
        'a valid password should contain an uppercase, lowercase, number and a special character e.g Alphamugerwa12$'
      );
    }
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.jwtSecret);

    if (!decoded) {
      return res.status(400).json({ status: 400, message: 'Invalid token' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const encryptedPassword = generateHarsh(password);
      await User.findOneAndUpdate({ email: user.email }, { password: encryptedPassword });
      return res.status(200).json({ status: 200, message: 'successfully resetted password' });
    }
    throw new httpError(
      500,
      'failed to reset password'
    );
  }

  /**
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @returns {Object} Response
   */
  async activateUserAccount(req, res) {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ status: 400, message: 'Invalid token' });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);

    if (!decoded) {
      return res.status(400).json({ status: 400, message: 'Invalid token' });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ status: 400, message: 'Invalid token' });
    }

    await User.findOneAndUpdate({ email: user.email }, { isVerified: true });
    return res.status(200).json({ status: 200, message: 'successfully resetted password' });
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async passwordResetEmail(req, res) {
    const { email } = req.body;
    if (!email) {
      throw new httpError(
        404,
        'please provide your email'
      );
    }
    const user = await User.findOne({ email });
    if (user) {
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }
      };
      await sendResetPasswordEmail(user.email, payload);
      return res.status(200).json({ message: 'successfully sent reset password link' });
    }
    throw new httpError(
      500,
      'failed to send password reset link'
    );
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  /* istanbul ignore next */
  // eslint-disable-next-line require-jsdoc
  async google(req, res) {
    try {
      const { name, emails, provider } = req.user;
      const dbUser = await User.findOne({ email: emails[0].value });
      const avatar = gravatar.url(emails[0].value, {
        s: 200,
        r: 'pg',
        d: 'mm'
      });
      const password = generateHarsh(emails[0].value);
      if (!dbUser) {
        const user = new User({
          name: `${name.givenName} ${name.familyName}`,
          email: emails[0].value,
          isVerified: emails[0].verified,
          isAdmin: false,
          password,
          avatar,
          auth: provider
        });
        await user.save();
        const token = generateToken({
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isVerified: emails[0].verified
          }
        });

        return res.redirect(`${process.env.FRONTEND_APP_URL}/auth/social?token=${token}`);
      }

      const user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar
      };
      const token = generateToken({
        user
      });

      return res.redirect(`${process.env.FRONTEND_APP_URL}/auth/social?token=${token}`);
    } catch (err) {
      return res.status(500).json({
        error: 'failed to login/signup with google'
      });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async createAdmin(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate({ _id: userId }, { isAdmin: true });
      await sendEmail({
        email: user.email,
        subject: 'Status',
        html: notificationTemplate('hhtt', user.name)
      });
      return res.status(200).json({ message: 'successfully made user an admin' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to create admin' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async revokeAdmin(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate({ _id: userId }, { isAdmin: false });
      await sendEmail({
        email: user.email,
        subject: 'Status',
        html: notificationTemplate('hhtt', user.name)
      });
      return res.status(200).json({ message: 'successfully changed role of user from admin to normal user' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to change admin role' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async deactivateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate({ _id: userId }, { isDeactivated: true });
      await sendEmail({
        email: user.email,
        subject: 'Status',
        html: notificationTemplate('hhtt', user.name)
      });
      return res.status(200).json({ message: 'successfully deactivated user' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to deactivate user' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async activateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate({ _id: userId }, { isDeactivated: false });
      await sendEmail({
        email: user.email,
        subject: 'Status',
        html: notificationTemplate('hhtt', user.name)
      });
      return res.status(200).json({ message: 'successfully activated user' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to activate user' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async changeCurrency(req, res) {
    try {
      const { id } = req.user;
      const { currency } = req.body;
      if (!currency) {
        return res.status(400).json({ error: 'please select a language' });
      }
      await User.findByIdAndUpdate({ _id: id }, { currency });
      return res.status(200).json({ message: `successfully changed default currency to ${currency}` });
    } catch (err) {
      return res.status(500).json({ error: 'failed to change currency' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async changeLanguage(req, res) {
    try {
      const { id } = req.user;
      const { language } = req.body;
      if (!language) {
        return res.status(400).json({ error: 'please select a language' });
      }
      await User.findByIdAndUpdate({ _id: id }, { language });
      return res.status(200).json({ message: `successfully changed default language to ${language}` });
    } catch (err) {
      return res.status(500).json({ error: 'failed to change language' });
    }
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
  */
  async getUsers(req, res) {
    const data = await User.paginate(
      {},
      { select: ['-password'] }
    );

    return res.status(200).json(
      formatPaginationResponse({ data, key: 'users' }),
    );
  }
}

export default UserController;
