import express from 'express';
import { uploadExcel } from '../Controllers/excelController.js';

const router = express.Router();

router.post('/uploadExcel', uploadExcel);

export default router;
