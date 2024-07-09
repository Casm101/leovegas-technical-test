// Module imports
import { Response, NextFunction } from 'express';

// Import services
import { authService } from '../services/auth.service';

// Import types
import { ExtendedRequest } from '../types/express';


// Declaration of auth middleware
export const authMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      statusCode: 401,
      message: 'No token provided'
    });
  } else {
    const token = authHeader?.split(' ')[1];

    try {
      const decodedToken = authService.authenticateToken(token);
      req.user = decodedToken;
      next();
    } catch {
      res.status(401).json({
        statusCode: 401,
        message: 'Unauthorised'
      });
    }
  }
};