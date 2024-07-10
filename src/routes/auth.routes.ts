// Module imports
import express from 'express';

// Controller and validator imports
import { authController } from '../controllers/auth.controller';
import { AuthValidator } from '../validators/auth.validator';

// Router declaration
const router = express.Router();

// Define auth routes

// Authenticate user
router.post('/', AuthValidator.authenticateUser, authController.authenticateUser);


// Export auth router module
export default router;