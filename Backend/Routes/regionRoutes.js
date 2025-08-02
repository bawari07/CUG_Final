import express from 'express';
import { getAllRegions } from '../Controllers/regionController.js';
//import {getBranchesByRegion} from '../Controllers/branchController.js'

const router = express.Router();

router.get('/regions', getAllRegions);
//router.get('/branches/:RID', getBranchesByRegion);

export default router;
