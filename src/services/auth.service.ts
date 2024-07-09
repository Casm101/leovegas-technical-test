// Module imports
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Type imports
import { JwtDecyptedUserToken } from '../types/jwt';

// Prisma declarations
const prisma = new PrismaClient();

// Retrieve secret key
const SECRET_KEY = process.env.SECRET_KEY || 'backup-secret-key';


// User login
const userLogin = async (
  email: User['email'],
  pass: User['password']
): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user || !bcrypt.compareSync(pass, user.password)) {
    throw new Error('Invalid email or password');
  }

  const newToken = jwt.sign(
    { id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' }
  );

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      access_token: newToken
    }
  });

  return newToken;
};

// Authenticate token
const authenticateToken = (token: string): JwtDecyptedUserToken => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtDecyptedUserToken;
  } catch {
    throw new Error('Invalid token');
  }
};

export const authService = {
  userLogin,
  authenticateToken
};