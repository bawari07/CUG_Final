import express from 'express';
import { handleSimRequest } from '../Controllers/handleSimRequestController.js';
import { authenticateJWT } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/simrequest', authenticateJWT, handleSimRequest);

export default router;