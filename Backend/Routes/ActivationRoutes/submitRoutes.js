import express from 'express';
import {submitSimRequest } from  '../../Controllers/Activation/submitController.js';
import { authenticateJWT } from '../../Middlewares/authMiddleware.js';

const router = express.Router();


router.post('/sim-requests', authenticateJWT,submitSimRequest);



export default router;