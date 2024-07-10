// Module imports
import express from 'express';
import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import AuthRouter from '../auth.routes';
import UserRouter from '../user.routes';

// Define express router
const app = express();
app.use(express.json());
app.use('/users', UserRouter);
app.use('/auth', AuthRouter);

// Define test data
let authUserId: User['id'];
let authUserToken: User['access_token'];
const data: Omit<User, 'id' | 'access_token'> = {
  name: 'auth',
  email: 'auth@runner.com',
  password: 'auth1234',
  role: 'USER'
};


// Define auth tests

// Create new user and authenticate
describe("Create new user on /users with post and authenticate on /auth", () => {

  /* Define passing tests */
  describe("Given correct data", () => {

    // Should create new user, saving details to DB
    // Should respond with status code 201
    // Store response in variables
    test("Create a new user with valid data - Should respond with 201", async () => {
      const response = await request(app)
        .post('/users')
        .send(data);

      // Expect statusCode 201
      expect(response.statusCode).toBe(201);
      expect(response.statusCode).not.toBe(400);

      // Store response data
      authUserId = response.body.data.user.id;
      authUserToken = response.body.data.token;
    });

    // Should retrieve user's information with stored token
    // Should respond with status code 200
    test("When getting user with same ID - Should respond with 200", async () => {
      const response = await request(app)
        .get(`/users/${authUserId}`)
        .set('Authorization', `Bearer ${authUserToken}`);

      // Expect statusCode 200
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(404);

      // Expect respose body and id
      const { password, ...responseBody } = data;
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(authUserId);
      expect(response.body.data).toMatchObject(responseBody);
    });

    // Should authenticate user given email and password
    // Should respond with status code 200
    test("When authenticating with email and pass - Should respond with 200", async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email: data.email, password: data.password });

      // Expect statusCode 200
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(404);

      // Expect token in response
      expect(response.body.data).toHaveProperty('token');
    });
  });

  /* Define failing tests */
  describe("Given false data", () => {

    // Should fail to authenticate with wrong password
    // Should respond with status code 401
    test("When authenticating with wrong password - Should respond with 401", async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email: data.email, password: 'wrong-password' });

      // Expect statusCode 200
      expect(response.statusCode).toBe(401);
      expect(response.statusCode).not.toBe(200);
    });

    // Should fail to authenticate with inexistant email
    // Should respond with status code 401
    test("When authenticating with wrong password - Should respond with 401", async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email: 'wrong@email.com', password: data.password });

      // Expect statusCode 200
      expect(response.statusCode).toBe(401);
      expect(response.statusCode).not.toBe(200);
    });
  });
});


/* Test cleanup - remove auth test user */
describe("Should remove any leftover users created by tests", () => {
  test("", async () => {
    const prisma = new PrismaClient();
    const response = await prisma.user.delete({ where: { id: authUserId } });

    expect(response.id).toBe(authUserId);
  });
});