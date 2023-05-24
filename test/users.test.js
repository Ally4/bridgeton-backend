import chai from 'chai';
import chaiHttp from 'chai-http';
import generateToken from '../helpers/generateToken';
import app from '../app';
import {
  signupUser,
  invalidUser,
  existingUser,
  loginUser,
  invalidLoginUser,
  invalidLoginUserPassword,
  passwordResetEmail,
  passwordReset
} from '../testingData/user.json';
import { profileContent, invalidToken } from '../testingData/profile.json';

let token;
let loginUserToken;
let security;

chai.use(chaiHttp);
chai.should();

before(async () => {});

describe('User', () => {
  it('Should create a user and return the status 201', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signupUser);
    res.should.have.status(201);
    res.body.should.have.property('message');
    token = res.body.token;
  });
  it("Should throw 400 request when all users's credentials are not provided ", async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(invalidUser);
    res.should.have.status(400);
  });
  it('Should throw 400 request email is not provided ', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'Blaise' });
    res.should.have.status(400);
  });
  it('Should throw 400 when name contains numbers ', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'Blaise23', email: 'mag@gmail.com', password: 'Balagade12$' });
    res.should.have.status(400);
  });
  it('Should throw 400 when email is not valid', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'Blaise', email: 'maggmail.com', password: 'Balagade12$' });
    res.should.have.status(400);
  });
  it('Should throw 400 when password is not valid', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'Blaise', email: 'mag@gmail.com', password: 'balagade12$' });
    res.should.have.status(400);
  });
  it('Should throw 400 request when the email address is already taken ', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(existingUser);
    res.should.have.status(409);
  });
  it('Should login a user and return the status 200', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(loginUser);
    res.should.have.status(200);
    loginUserToken = res.body.token;
  });
  it('Should not login with wrong email address', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(invalidLoginUser);
    res.should.have.status(400);
  });
  it('Should not login with wrong password', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(invalidLoginUserPassword);
    res.should.have.status(400);
  });
  it('Should send reset link when provided email', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/password-link')
      .set('Content-Type', 'application/json')
      .send(passwordResetEmail);
    res.should.have.status(200);
  });
  it('Should not send link when email is not provided', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/password-link')
      .set('Content-Type', 'application/json')
      .send();
    res.should.have.status(404);
  });
  it('Should not send link when email is not for a registered user', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/password-link')
      .set('Content-Type', 'application/json')
      .send({ email: 'mugerwalumu@gmail.com' });
    res.should.have.status(500);
  });
  it('Should reset password', async () => {
    const pwdToken = generateToken({ email: 'jaman@gmail.com' });
    const res = await chai
      .request(app)
      .post(`/api/users/reset-password?token=${pwdToken}`)
      .set('Content-Type', 'application/json')
      .send(passwordReset);
    res.should.have.status(200);
  });
  it('Should not reset password when it is not valid or wrong', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/reset-password')
      .set('Content-Type', 'application/json')
      .send();
    res.should.have.status(400);
  });
  it('Should not reset password with wrong token', async () => {
    const pwdToken = { generate: generateToken({ email: 'jaman@gmail.com' }) };
    const res = await chai
      .request(app)
      .post(`/api/users/reset-password?token=${pwdToken}`)
      .set('Content-Type', 'application/json')
      .send(passwordReset);
    res.should.have.status(500);
  });
  it('Should create security question', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/questions')
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({ number: 1, answer: 'food' });
    security = res.body.security._id;
    res.should.have.status(201);
  });
  it('Should not create security question after one has been created', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/questions')
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({ number: 1, answer: 'food' });
    res.should.have.status(409);
  });
  it('Should not create security question with invalid data', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/questions')
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({ answer: 'food' });
    res.should.have.status(400);
  });
  it('Should get security questions', async () => {
    const res = await chai
      .request(app)
      .get('/api/users/questions')
      .set('Content-Type', 'application/json')
      .set('auth-token', token);
    res.should.have.status(200);
  });
  it('Should update security question', async () => {
    const res = await chai
      .request(app)
      .put(`/api/users/questions/${security}`)
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({ number: 2, answer: 'food' });
    res.should.have.status(200);
  });
  it('Should not update security question with invalid data', async () => {
    const res = await chai
      .request(app)
      .put(`/api/users/questions/${security}`)
      .set('Content-Type', 'application/json')
      .set('auth-token', token)
      .send({ answer: 'food' });
    res.should.have.status(400);
  });

  describe('Profile', () => {
    it('Should not create a profile without a token return a status of 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/profile')
        .send(profileContent);
      res.should.have.status(401);
    });
    it('Should not create a profile with an invalid token, will return a status of 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/profile')
        .set('auth-token', invalidToken)
        .send(profileContent);
      res.should.have.status(401);
    });
    it('Should create a profile and return a status of 201', async () => {
      const res = await chai
        .request(app)
        .post('/api/profile')
        .set('auth-token', token)
        .send(profileContent);
      res.should.have.status(201);
    });
    it('Should update the profile and return a status of 200', async () => {
      const res = await chai
        .request(app)
        .post('/api/profile')
        .set('auth-token', token)
        .send(profileContent);
      res.should.have.status(200);
    });
    it('Should get the authenticated user profile and return the status 200', async () => {
      const res = await chai
        .request(app)
        .get('/api/profile/me')
        .set('auth-token', token)
        .send(profileContent);
      res.should.have.status(200);
    });
  });
});
