import express from 'express';
import { createUser } from '../Controllers/userController.js';
import { authenticateJWT } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT ,  createUser);

export default router;
