// Module imports
import { z } from 'zod';

// Schema declarations
const create = z.object({
  name: z.string().min(3).max(256),
  email: z.string().email(),
  password: z.string().min(8).max(256),
  role: z.enum(['ADMIN', 'USER'])
});

const update = z.object({
  name: z.string().min(3).max(256).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'USER']).optional()
});

export const UserSchema = {
  create,
  update
};