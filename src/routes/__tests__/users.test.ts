// Module imports
import express from 'express';
import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import UserRouter from '../user.routes';

// Define express router
const app = express();
app.use(express.json());
app.use('/users', UserRouter);

// Define test data
let createdId: User['id'];
let createdAccessToken: User['access_token'];
const data: Omit<User, 'id' | 'access_token'> = {
  name: 'Test Runner',
  email: 'test@runner.com',
  password: 'test1234',
  role: 'ADMIN'
};

// Define user route tests

// Create new user tests
describe("Create new user on / with post method", () => {

  /* Define passing tests */
  describe("Given correct data", () => {

    // Should save name, description and permissions to DB
    // Should respond with status code 201
    // Should respond with json with id and request data
    test("Should respond with status 201 and json data", async () => {
      const response = await request(app)
        .post('/users')
        .send(data);

      // Expect statusCode 201
      expect(response.statusCode).toBe(201);
      expect(response.statusCode).not.toBe(400);

      // Expect respose body and id
      const { password, ...responseBody } = data;
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toMatchObject(responseBody);

      createdId = response.body.data.user.id;
      createdAccessToken = response.body.data.token;
    });
  });

  /* Define failing tests */
  describe('Given invalid data', () => {

    // Should fail to store data in DB becuase of validation
    // Should respond with status code 400
    test("Bad name - Should respond with 400", async () => {

      const response = await request(app)
        .post('/users')
        .send({
          name: 'Ch',
          email: 'christian@test.com',
          password: 'password1234',
          role: 'ADMIN'
        });

      // Expect statusCode 201
      expect(response.statusCode).toBe(400);
      expect(response.statusCode).not.toBe(201);
    });
  });
});

// Get existing user test
describe("Get user on /:id with get method", () => {

  /* Define passing tests */
  describe("Shoud pass when", () => {

    test("When given an existing user ID - Should respond with 200", async () => {

      const response = await request(app)
        .get(`/users/${createdId}`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 200
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(404);

      // Expect respose body and id
      const { password, ...responseBody } = data;
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toMatchObject(responseBody);
    });
  });

  /* Define failing tests */
  describe("Should fail when", () => {

    test("When given a non-existant user ID - Should respond with 404", async () => {

      const response = await request(app)
        .get(`/users/1234-4567-890A`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 404
      expect(response.statusCode).toBe(404);
      expect(response.statusCode).not.toBe(200);
    });
  });
});


// Delete existing user tests
describe('Delete user on /:id with del method', () => {

  let toBeDeletedId: User['id'];

  /* Define passing tests */
  describe("Should pass when", () => {

    test("Existing user and admin - Should respond with 204", async () => {

      const user = await request(app)
        .post('/users')
        .send({
          name: 'Test Runner',
          email: 'test1@runner.com',
          password: 'test1234',
          role: 'ADMIN'
        });

      toBeDeletedId = user.body.data.user.id;

      const response = await request(app)
        .delete(`/users/${user.body.data.user.id}`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 203
      expect(response.statusCode).toBe(204);
      expect(response.statusCode).not.toBe(404);
    })
  });

  /* Define failing tests */
  describe("Should fail when", () => {

    test("Missing user and admin - Should respond with 404", async () => {
      const response = await request(app)
        .delete(`/users/${toBeDeletedId}`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 203
      expect(response.statusCode).toBe(404);
      expect(response.statusCode).not.toBe(204);
    });
  });
});


/* Test cleanup - remove test user */
describe("Should remove any leftover users created by tests", () => {
  test("", async () => {
    const prisma = new PrismaClient();
    const response = await prisma.user.delete({ where: { id: createdId } });

    expect(response.id).toBe(createdId);
  });
});

