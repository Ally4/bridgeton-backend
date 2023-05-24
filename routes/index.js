import express from 'express';
import users from './api/users';
import profile from './api/profile';
import category from './api/category';
import products from './api/products';
import search from './api/search';
import cart from './api/cart';
import orders from './api/orders';
import design from './api/design';
import wishList from './api/wishList';
import collections from './api/corrections/corrections.route'
import designers from './api/designers/designers.route'

// Initilise the app

const app = express();

// Router configuration

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/category', category);
app.use('/api/products', products);
app.use('/api/designers', designers);
app.use('/api/search', search);
app.use('/api/cart', cart);
app.use('/api/collections', collections)
app.use('/api/orders', orders);
app.use('/api/designs', design);
app.use('/api/wishlist', wishList);

export default app;
