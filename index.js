import express from 'express';
import app from './app';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/db';
import router from './routes/index';
import swaggerDoc from './swagger.json';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Running on ${port}`);
// Connect to the db
connectDB();

// Init Middlware

app.use(express.json({ extended: false }));

app.use(router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Page not found'
  });
});
});