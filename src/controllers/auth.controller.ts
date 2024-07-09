// Module imports
import { Request, Response } from "express";

// Import services
import { authService } from "../services/auth.service";


// Controller declarations

// Authenticate user
const authenticateUser = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  try {
    const token = await authService.userLogin(email, password);

    res.status(200).json({
      stausCode: 200,
      data: {
        token
      }
    });
  } catch (err) {

    console.log(err);

    if ((err as any)?.message.includes('email or password')) return res.status(401).json({
      statusCode: 401,
      messsage: 'Invalid email or password.'
    });

    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

export const authController = {
  authenticateUser
};