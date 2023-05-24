import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import connectDB from './config/db';
import router from './routes';

const app = express();

app.use(cors());

// Connect to the db
connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.jwtSecret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Page not found'
  });
});

app.use((err, req, res) => {
  const status = err.status || 500;
  const error = err.message || 'Internal Errror';
  res.status(status).send({
    status,
    error,
  });
});

export default app;
