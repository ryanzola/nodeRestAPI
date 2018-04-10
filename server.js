require('dotenv').config();
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import productRoutes from './api/routes/products';
import orderRoutes from './api/routes/orders';
import userRoutes from './api/routes/user';

const app = express();

app.use(morgan('dev'));
app.set('port', process.env.PORT || 3000);
app.use(express.static('./dist'));
app.use('/dist', express.static(__dirname + 'dist'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Accept, Authorization, Content-Type'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(app.get('port'), () => {
  console.info(`Listening: http://localhost:${app.get('port')}`);
});
