import express from 'express';
import {requestinit } from  '../../Controllers/Activation/requestinitController.js';


const router = express.Router();



router.post('/reqinit', requestinit);



export default router;