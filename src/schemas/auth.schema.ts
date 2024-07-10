// Import modules
import { z } from "zod";

// Schema declarations
const authenticate = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256),
});

export const AuthSchema = {
  authenticate
};