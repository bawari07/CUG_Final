import express from 'express';
import { Hr } from '../Controllers/hrController.js';

const router = express.Router();

router.post('/hr', Hr);

export default router;