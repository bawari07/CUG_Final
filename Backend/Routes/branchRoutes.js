import express from 'express';
import { getBranchesByRegion } from '../Controllers/branchController.js';

const router = express.Router();

router.get('/:region', getBranchesByRegion);

export default router;
