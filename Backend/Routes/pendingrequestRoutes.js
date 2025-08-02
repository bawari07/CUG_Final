import express from 'express';
import { pendingRequests } from '../Controllers/pendingRequestsController.js';
import {getApprovalRequests} from '../Controllers/getApprovalRequest.js';
import {approveSimRequest} from '../Controllers/approvalController.js';
import { authenticateJWT } from '../Middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/pending', pendingRequests);
router.get('/approval', getApprovalRequests);
router.post('/approve-request', authenticateJWT ,approveSimRequest);

export default router;
