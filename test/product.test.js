import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { products, categoryToUse, design } from '../testingData/products.json';
import { normalUserLogin, isNotTheOwnerLogin, existingUser } from '../testingData/user.json';
import Products from '../models/Products';


chai.use(chaiHttp);
chai.should();

let token;
let productId;
let categoryId;
let isNotAminToken;
let isNotTheOwnerToken;
let designId;

describe('Products', () => {
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(normalUserLogin);
    isNotAminToken = res.body.token;

    const result = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(isNotTheOwnerLogin);
    isNotTheOwnerToken = result.body.token;

    const results = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(existingUser);
    token = results.body.token;

    const category = await chai
      .request(app)
      .post('/api/category')
      .set('auth-token', token)
      .send(categoryToUse);
    categoryId = category.body.category._id;
  });
  it('Should return 404 when there are no designs', async () => {
    const res = await chai
      .request(app)
      .get('/api/designs')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(404);
  });

  it('Should create design with authenticated user', async () => {
    const res = await chai
      .request(app)
      .post('/api/designs')
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send(design);
    designId = res.body.design._id;
    res.should.have.status(201);
  });

  it('Should not create design with unauthenticated user', async () => {
    const res = await chai
      .request(app)
      .post('/api/designs')
      .set('Content-Type', 'application/json')
      .send(design);
    res.should.have.status(401);
  });

  it('Should not create design with invalid data', async () => {
    const res = await chai
      .request(app)
      .post('/api/designs')
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({});
    res.should.have.status(400);
  });

  it('Should get designs', async () => {
    const res = await chai
      .request(app)
      .get('/api/designs')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(200);
  });

  it('Should get a design', async () => {
    const res = await chai
      .request(app)
      .get(`/api/designs/${designId}`)
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(200);
  });

  it('Should update a design', async () => {
    const res = await chai
      .request(app)
      .put(`/api/designs/${designId}`)
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send(design);
    res.should.have.status(200);
  });

  it('Should delete a design', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/designs/${designId}`)
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send(design);
    res.should.have.status(204);
  });
  it('Should not create product if the user is not an Admin return the status 403', async () => {
    const res = await chai
      .request(app)
      .post(`/api/products/${categoryId}`)
      .set('auth-token', isNotAminToken);
    res.should.have.status(403);
  });
  it('Should create a product and return the status 201', async () => {
    const res = await chai
      .request(app)
      .post(`/api/products/${categoryId}`)
      .set('auth-token', token)
      .send(products);
    res.should.have.status(201);
    productId = res.body.products._id;
  });
  it('Should not perform an action on product if the Admin is not the owner, will return the status 401', async () => {
    const res = await chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set('auth-token', isNotTheOwnerToken)
      .send(products);
    res.should.have.status(403);
  });
  it('Should get all products and return the status 200', async () => {
    const res = await chai
      .request(app)
      .get('/api/products')
      .set('Content-Type', 'application/json');
    res.should.have.status(200);
  });
  it('Should get one product and return the status 200', async () => {
    const res = await chai
      .request(app)
      .get(`/api/products/${productId}`)
      .set('Content-Type', 'application/json');
    res.should.have.status(200);
  });
  it('Should return 404 if there are no orders', async () => {
    const res = await chai
      .request(app)
      .get('/api/orders')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(404);
  });
  it('Should make order', async () => {
    const res = await chai
      .request(app)
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(400);
  });
  it('Should not order for an empty cart', async () => {
    const res = await chai
      .request(app)
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(400);
    it('Should get orders', async () => {
      const res = await chai
        .request(app)
        .get('/api/orders')
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(200);
    });
    it('Should update one product and return the status 200', async () => {
      const res = await chai
        .request(app)
        .put(`/api/products/${productId}`)
        .set('auth-token', token)
        .send(products);
      res.should.have.status(200);
    });
    it('Should add product to cart', async () => {
      const res = await chai
        .request(app)
        .post(`/api/cart/${productId}`)
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(201);
    });
    it('Should not add product to cart that has already been added', async () => {
      const res = await chai
        .request(app)
        .post(`/api/cart/${productId}`)
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(409);
    });
    it('Should get items on cart', async () => {
      const res = await chai
        .request(app)
        .get('/api/cart')
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(200);
    });
    it('Should remove product from cart', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/cart/${productId}`)
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(204);
    });
    it('Should return a 404 if product has already been removed', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/cart/${productId}`)
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(404);
    });
    it('Should return 404 when items aint there items on cart', async () => {
      const res = await chai
        .request(app)
        .get('/api/cart')
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(404);
    });
    it('Should add product to cart after deleting', async () => {
      const res = await chai
        .request(app)
        .post(`/api/cart/${productId}`)
        .set('Content-Type', 'application/json')
        .set('auth-token', token);
      res.should.have.status(201);
    });
    it('Should delete one product and return the status 200', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/products/${productId}`)
        .set('auth-token', token);
      res.should.have.status(200);
    });
    it('Should return the status 404 if there is not available product', async () => {
      await Products.remove({});
      const res = await chai
        .request(app)
        .get('/api/products')
        .set('Content-Type', 'application/json');
      res.should.have.status(404);
    });
    it('Should return the status 404 if there is not product', async () => {
      const res = await chai
        .request(app)
        .get(`/api/products/${productId}`)
        .set('Content-Type', 'application/json');
      res.should.have.status(404);
    });
  });
});
