import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import passportConfig from '../config/socialAuth';

passport.use(
  new GoogleStrategy(
    passportConfig.google,
    passportConfig.google.callbackFunc
  )
);

passport.use(
  new FacebookStrategy(
    passportConfig.facebook,
    passportConfig.facebook.callbackFunc
  )
);

passport.serializeUser(passportConfig.serializeUser);

passport.deserializeUser(passportConfig.deserializeUser);

export default passport;
