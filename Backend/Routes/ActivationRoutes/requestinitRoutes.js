import express from 'express';
import {requestinit } from  '../../Controllers/Activation/requestinitController.js';
import { authenticateJWT } from '../../Middlewares/authMiddleware.js';

const router = express.Router();



router.post('/reqinit', authenticateJWT, requestinit);



export default router;