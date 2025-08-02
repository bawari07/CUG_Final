import express from 'express';
import { getLoginTypes } from '../Controllers/loginTypeController.js';

const router = express.Router();

router.get('/types', getLoginTypes);

export default router;
