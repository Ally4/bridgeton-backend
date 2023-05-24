/* istanbul ignore file */
import dotenv from 'dotenv';

dotenv.config();

export default {
  serializeUser: (user, done) => done(null, user),
  deserializeUser: (obj, done) => done(null, obj),
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_APP_URL}/api/users/auth/facebook/callback`,
    profileFields: ['id', 'name', 'photos', 'email'],
    callbackFunc: (accessToken, refreshToken, profile, cb) => cb(null, profile)
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_APP_URL}/api/users/auth/google/callback`,
    callbackFunc: (accessToken, refreshToken, profile, cb) => cb(null, profile)
  },
};
