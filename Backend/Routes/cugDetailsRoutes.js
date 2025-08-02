import express from 'express';
import { GetCugDetails , getAllCugDeatails} from '../Controllers/cugDetailsController.js';

const router = express.Router();

router.get('/iccidNumber', getAllCugDeatails);
router.get('/:iccidNumber', GetCugDetails);

export default router;
