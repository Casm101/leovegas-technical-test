// Module imports
import express from 'express';
import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import UserRouter from '../user.routes';

// Define express router
const app = express();
app.use(express.json());
app.use('/users', UserRouter);

// Define admin test data
let createdId: User['id'];
let createdAccessToken: User['access_token'];
const data: Omit<User, 'id' | 'access_token'> = {
  name: 'Test Runner',
  email: 'test@runner.com',
  password: 'test1234',
  role: 'ADMIN'
};

// Define user test data
let standardUserId: User['id'];
let standardUserAccessToken: User['access_token'];
const standardData: Omit<User, 'id' | 'access_token'> = {
  name: 'Standard Runner',
  email: 'standard@runner.com',
  password: 'standard1234',
  role: 'USER'
};

// Define user route tests

// Create new user tests
describe("Create new user on / with POST method", () => {

  /* Define passing tests */
  describe("Given correct data", () => {

    // Should create ADMIN user and store data to DB
    // Should respond with status code 201
    // Should respond with json with id and request data
    test("Create an ADMIN user - Should respond with 201", async () => {
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

    // Should create standard user and store data to DB
    // Should respond with status code 201
    // Should respond with json with id and request data
    test("Create an ADMIN user - Should respond with 201", async () => {
      const response = await request(app)
        .post('/users')
        .send(standardData);

      // Expect statusCode 201
      expect(response.statusCode).toBe(201);
      expect(response.statusCode).not.toBe(400);

      // Expect respose body and id
      const { password, ...responseBody } = standardData;
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toMatchObject(responseBody);

      standardUserId = response.body.data.user.id;
      standardUserAccessToken = response.body.data.token;
    });
  });

  /* Define failing tests */
  describe('Given invalid data', () => {

    // Should fail to create user with existing email
    // Should respond with status code 500
    test("Fail to create user with existing email - Should respond with 500", async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Existing email user',
          email: 'test@runner.com',
          password: 'password1234',
          role: 'USER'
        });

      // Expect statusCode 201
      expect(response.statusCode).toBe(500);
      expect(response.statusCode).not.toBe(201);
    });

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

// Get existing user tests
describe("Get user on /:id with GET method", () => {

  /* Define passing tests */
  describe("Shoud pass when", () => {

    // Should retrieve same user data 
    // Should respond with status code 200
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

    // Should fail to find a user
    // Should respond with status code 404
    test("When given a non-existant user ID - Should respond with 404", async () => {
      const response = await request(app)
        .get(`/users/1234-4567-890A`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 404
      expect(response.statusCode).toBe(404);
      expect(response.statusCode).not.toBe(200);
    });

    // Should fail to get another user's data
    // Should cause authentication error
    // Should respond with 403
    test("When accessing another user's data as standard user - Should respond with 403", async () => {
      const response = await request(app)
        .get(`/users/${createdId}`)
        .set('Authorization', `Bearer ${standardUserAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(200);
    });
  });
});

// Get many users test
describe("Get many users on / with GET method", () => {

  /* Define passing tests */
  describe("Should pass when", () => {

    // Should retrieve all users as admin
    // Should respond with status code 200
    test("When getting many users as admin - Should respond with 200", async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 200
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(404);
    });
  });

  /* Define failing tests */
  describe("Should fail when", () => {

    // Should fail to retrive all users as standard user
    // Should cause authentication error
    // Should respond with status code 403
    test("When getting many users as standard user - Should respond with 403", async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${standardUserAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(200);
    })
  });
});

// Update existing user tests
describe("Update user on /:id with PATCH method", () => {

  /* Define passing tests */
  describe("Should pass when", () => {

    // Should update user's name and email
    // Should respond with status code 200
    test("When given valid name and email for existing user - Should respond with 200", async () => {
      const response = await request(app)
        .patch(`/users/${createdId}`)
        .send({
          name: 'Peter Griffin',
          email: 'peter@familyguy.com'
        })
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 200
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(400);

      // Expect respose body and id
      const { password, ...responseBody } = data;
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toMatchObject({
        ...responseBody,
        name: 'Peter Griffin',
        email: 'peter@familyguy.com'
      });
    });
  });

  /* Define failing tests */
  describe("Should fail when", () => {

    // Should fail when updating with invalid email
    // Should respond with status code 400
    test("When given invalid email for existing user - Should respond with 400", async () => {
      const response = await request(app)
        .patch(`/users/${createdId}`)
        .send({
          email: 'test.test.com'
        })
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 400
      expect(response.statusCode).toBe(400);
      expect(response.statusCode).not.toBe(200);
    });

    // Should fail to update another user's data
    // Should cause authentication error
    // Should respond with status code 403
    test("When trying to update another user's data as standard user - Should respond with 403", async () => {
      const response = await request(app)
        .patch(`/users/${createdId}`)
        .send({
          email: 'test@test.com'
        })
        .set('Authorization', `Bearer ${standardUserAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(200);
    });
  });
});

// Delete existing user tests
describe('Delete user on /:id with DELETE method', () => {

  let toBeDeletedId: User['id'];

  /* Define passing tests */
  describe("Should pass when", () => {

    // Should delete another existing user as admin
    // Should respond with staus code 204
    test("When deleting existing user as admin - Should respond with 204", async () => {

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

      // Expect statusCode 204
      expect(response.statusCode).toBe(204);
      expect(response.statusCode).not.toBe(404);
    })
  });

  /* Define failing tests */
  describe("Should fail when", () => {

    // Should fail to delete non-existant user as admin
    // Should respond with status code 404
    test("WWhen admin attempts to delete non-existant user - Should respond with 404", async () => {
      const response = await request(app)
        .delete(`/users/${toBeDeletedId}`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 404
      expect(response.statusCode).toBe(404);
      expect(response.statusCode).not.toBe(204);
    });

    // Should fail to delete own account as admin
    // Should cause authentication error
    // Should respond with status code 403
    test("When ADMIN attempts to delete own user - Should respond with 403", async () => {
      const response = await request(app)
        .delete(`/users/${createdId}`)
        .set('Authorization', `Bearer ${createdAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(204);
    });

    // Should fail to delete own account as USER
    // Should cause authentication error
    // Should respond with status code 403
    test("When USER attempts to delete own user - Should respond with 403", async () => {
      const response = await request(app)
        .delete(`/users/${standardUserId}`)
        .set('Authorization', `Bearer ${standardUserAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(204);
    });

    // Should fail to delete another account as USER
    // Should cause authentication error
    // Should respond with status code 403
    test("When USER attempts to delete another user - Should respond with 403", async () => {
      const response = await request(app)
        .delete(`/users/${createdId}`)
        .set('Authorization', `Bearer ${standardUserAccessToken}`);

      // Expect statusCode 403
      expect(response.statusCode).toBe(403);
      expect(response.statusCode).not.toBe(204);
    });
  });
});


/* Test cleanup - remove test users */
describe("Should remove any leftover users created by tests", () => {

  // Should successfuly delete ADMIN user
  test("Delete ADMIN user", async () => {
    const prisma = new PrismaClient();
    const response = await prisma.user.delete({ where: { id: createdId } });

    expect(response.id).toBe(createdId);
  });

  // Should successfuly delete standard user
  test("Delete standard user", async () => {
    const prisma = new PrismaClient();
    const response = await prisma.user.delete({ where: { id: standardUserId } });

    expect(response.id).toBe(standardUserId);
  });
});

