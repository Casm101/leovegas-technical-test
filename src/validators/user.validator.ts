// Module imports
import { Request, Response, NextFunction } from 'express';

// Schema imports
import { UserSchema } from '../schemas/user.schema';

// Declaration of user validator

// User creation validation
const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    UserSchema.create.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: err
    });
  }
};

// User update validation
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    UserSchema.update.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: err
    });
  }
};


export const UserValidator = {
  createUser,
  updateUser
};