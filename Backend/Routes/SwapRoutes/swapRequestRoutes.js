import express from 'express';
import { swapRequests } from '../../Controllers/SwapSim/swapRequest.js'; 

const router = express.Router();


router.get('/swapRequests', swapRequests);

export default router;
