// Module import
import { Router } from "express";

// Router imports
import AuthRouter from './auth.routes';
import UserRouter from './user.routes';


// Declare global router
const router = Router();

router.use('/users', UserRouter);
router.use('/auth', AuthRouter);


// Export all routes
export = {
  routes: router,
  version: "1.0"
}