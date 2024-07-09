// Module imports
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Import services
import { userService } from './../services/user.service';

// Type imports
import { ExtendedRequest } from "../types/express";

// Prisma declaration
const prisma = new PrismaClient();

// Retrieve secret key
const SECRET_KEY = process.env.SECRET_KEY || 'backup-secret-key';


// Controller declarations

// Create user
const createUser = async (req: Request, res: Response) => {

  try {
    // Encrypt password
    const { password, ...body } = req.body;
    const hashedPass = bcrypt.hashSync(password, 10);

    // Create user and token
    const user = await userService.createUser({ ...body, password: hashedPass });
    const newToken = jwt.sign(
      { id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' }
    );

    // Add token to user
    await userService.updateUser(user.id, { access_token: newToken });

    res.status(201).json({
      statusCode: 201,
      data: {
        user,
        token: newToken
      }
    });

  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      internalError: err
    })
  }
};

// Get user
const getUser = async (req: ExtendedRequest, res: Response) => {

  const isAdmin = req.user?.role === 'ADMIN';

  try {
    const user = await userService.getUser(req.params.id);

    // Return if user does not exits
    if (!user) return res.status(404).json({
      statusCode: 404,
      messsage: 'User not found.'
    });

    // Return data if user is authorised
    if (isAdmin || req.user?.id === user.id) {
      res.status(200).json({
        statusCode: 200,
        data: user
      });
    } else {
      res.status(403).json({
        statusCode: 403,
        message: "Forbidden, you don't have permissions to access this user."
      })
    }
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      internalError: err
    });
  }
};

// Get many users
const getUsers = async (req: ExtendedRequest, res: Response) => {

  const isAdmin = req.user?.role === 'ADMIN';

  try {

    // Return data if user is admin
    if (isAdmin) {
      const users = await userService.getManyUsers();

      res.status(200).json({
        statusCode: 200,
        data: users
      });
    } else {
      res.status(403).json({
        statusCode: 403,
        message: "Forbidden, you don't have permissions read all users."
      })
    }
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      internalError: err
    })
  }
};

// Update user
const updateUser = async (req: ExtendedRequest, res: Response) => {

  const isAdmin = req.user?.role === 'ADMIN';

  try {
    const { password, ...sanitisedBody } = req.body;
    const user = await userService.getUser(req.params.id);

    // Update user if user is authorised to
    if (isAdmin || req.user?.id === user?.id) {
      const updatedUser = await userService.updateUser(req.params.id, sanitisedBody);

      res.status(200).json({
        statusCode: 200,
        data: updatedUser
      });
    } else {
      res.status(403).json({
        statusCode: 403,
        message: "Forbidden, you don't have permissions to update this user."
      })
    }
  } catch (err) {

    console.log(err);

    if ((err as any)?.message.includes('not found')) return res.status(404).json({
      statusCode: 404,
      messsage: 'User not found.'
    });

    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      internalError: err
    });
  }
};

// Delete user
const deleteUser = async (req: ExtendedRequest, res: Response) => {

  const isAdmin = req.user?.role === 'ADMIN';

  try {
    const userId = req.params.id;
    const user = await userService.getUser(userId);

    if (isAdmin && user?.id !== req.user?.id) {
      await userService.deleteUser(req.params.id);

      res.status(204).json({
        statusCode: 204,
        message: 'User deleted correctly.'
      });
    } else {
      res.status(403).json({
        statusCode: 403,
        message: "Forbidden, you don't have permissions to delete this user."
      })
    }

  } catch (err) {

    if ((err as any).meta.cause.includes('not exist')) return res.status(404).json({
      statusCode: 404,
      messsage: 'User not found.'
    });

    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      internalError: err
    });
  }
};

export const userController = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
};