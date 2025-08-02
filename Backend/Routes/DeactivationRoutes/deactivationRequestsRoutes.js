import express from 'express';
import { deactivationpendingRequests } from '../../Controllers/Deactivation/requestController.js'; 

const router = express.Router();


router.get('/deactivationRequests', deactivationpendingRequests);

export default router;
