import express from 'express';
import {submitSimRequest } from  '../../Controllers/Deactivation/submitRequest.js';
import { authenticateJWT } from '../../Middlewares/authMiddleware.js';

const router = express.Router();


router.post('/submitdeacivate',authenticateJWT,submitSimRequest);



export default router;