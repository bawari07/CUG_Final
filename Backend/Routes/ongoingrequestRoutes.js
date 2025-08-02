import express from 'express';
import { pendingRequests } from '../Controllers/pendingRequestsController.js';

const router = express.Router();

router.get('/ongoing', pendingRequests);

export default router;
