import express from 'express';
import { fetchEmployeeData } from '../Controllers/employeeController.js';

const router = express.Router();

router.post('/:employeeCode', fetchEmployeeData);

export default router;