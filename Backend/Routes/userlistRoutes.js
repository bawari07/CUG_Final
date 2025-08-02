import express from 'express';
import { userList , toggleUserActivation} from '../Controllers/userlistController.js';

const router = express.Router();


router.get('/users', userList);


router.put('/users/deactivate/:employeeCode', toggleUserActivation);

export default router;
