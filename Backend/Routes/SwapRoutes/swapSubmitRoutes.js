import express from 'express';
import {swapSubmitReq} from '../../Controllers/SwapSim/submitRequestController.js';
import { authenticateJWT } from '../../Middlewares/authMiddleware.js';


const router = express.Router();

router.post('/swapSubmit' ,authenticateJWT ,swapSubmitReq )

export default router;