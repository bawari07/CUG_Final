import express from 'express';
import { saveTelecomData , getDetails, updateSimCardDetails} from '../Controllers/bulkUploadController.js';

const router = express.Router();

router.post('/bulkupload', saveTelecomData);
router.get('/details', getDetails);
router.put('/update', updateSimCardDetails)

export default router;











