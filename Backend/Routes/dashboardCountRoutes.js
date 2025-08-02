import express from 'express';
import { dashboardCount } from '../Controllers/dashboardCountController.js';

const router = express.Router();

router.post('/dashboardCount', dashboardCount);

export default router;
