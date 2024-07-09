// Module imports
import express from 'express';

// Controller imports
import { authController } from '../controllers/auth.controller';

// Router declaration
const router = express.Router();

// Define auth routes

// Authenticate user
router.post('/', authController.authenticateUser);


// Export auth router module
export default router;