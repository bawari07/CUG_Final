import express from 'express';
import {sendIntimation } from  '../Controllers/sendIntimation.js';
import { authenticateJWT } from '../Middlewares/authMiddleware.js';

const router = express.Router();


router.post('/sendmail', authenticateJWT,sendIntimation);



export default router;