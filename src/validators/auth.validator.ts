// Module imports
import { Request, Response, NextFunction } from 'express';

// Schema imports
import { AuthSchema } from '../schemas/auth.schema';

// Declaration of auth validator

// User authentication validation
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    AuthSchema.authenticate.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: err
    });
  }
};

export const AuthValidator = {
  authenticateUser
};