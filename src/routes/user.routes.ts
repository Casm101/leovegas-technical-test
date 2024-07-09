// Module imports
import express from 'express';

// Controller and validator imports
import { userController } from '../controllers/user.controller';
import { UserValidator } from '../validators/user.validator';

// Middleware imports
import { authMiddleware } from '../middleware/auth.middleware';

// Router declaration
const router = express.Router();


// Define User routes

// Create user
router.post('/', UserValidator.createUser, userController.createUser);

// Get user by id
router.get('/:id', authMiddleware, userController.getUser);

// Get many users
router.get('/', authMiddleware, userController.getUsers);

// Update user by id
router.patch('/:id', authMiddleware, UserValidator.updateUser, userController.updateUser);

// Delete user by id
router.delete('/:id', authMiddleware, userController.deleteUser);

// Export user router module
export default router;