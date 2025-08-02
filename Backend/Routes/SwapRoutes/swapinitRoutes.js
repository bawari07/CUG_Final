import express from 'express';
import {swapinitRequest } from  '../../Controllers/SwapSim/reqinitController.js';


const router = express.Router();



router.post('/swapreqinit', swapinitRequest);



export default router;