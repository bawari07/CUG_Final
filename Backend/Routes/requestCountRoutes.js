import express from 'express';
import { countRequests } from '../Controllers/requestCountController.js';

const router = express.Router();

router.get('/count', countRequests);

export default router;
