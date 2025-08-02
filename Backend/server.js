import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import morgan from "morgan";
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import authRoutes from "./Routes/authRoutes.js";
import { connectToDatabase } from "./Database/db.js";
import regionRoutes from './Routes/regionRoutes.js';
import loginTypeRoutes from './Routes/loginTypeRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import { authenticateJWT } from './Middlewares/authMiddleware.js';
import requestsRoutes from './Routes/pendingrequestRoutes.js';
import submitRoutes from './Routes/ActivationRoutes/submitRoutes.js';
import hrRoutes from './Routes/hrRoutes.js';
import employeeRoutes  from './Routes/employeeRoutes.js';
import branchRoutes from './Routes/branchRoutes.js';
import usersRoutes from './Routes/userlistRoutes.js';
import requestinit from './Routes/ActivationRoutes/requestinitRoutes.js';
import deactivationRequestsRoutes from './Routes/DeactivationRoutes/deactivationRequestsRoutes.js';
import deactivateSubmitRoutes from './Routes/DeactivationRoutes/submitRequestRoutes.js';
import swaprequestRoutes from './Routes/SwapRoutes/swapRequestRoutes.js';
import ongoingRequestRoutes from './Routes/ongoingrequestRoutes.js';
//Count
import countRequestsRoutes from './Routes/requestCountRoutes.js';
import dashboardCountRoutes from './Routes/dashboardCountRoutes.js';

import swapinitRoutes from './Routes/SwapRoutes/swapinitRoutes.js';
import swapSubmitRoutes  from './Routes/SwapRoutes/swapSubmitRoutes.js';
import handleSimRequest from './Routes/handleSimRequestRoutes.js';
import bulkUploadRoutes from './Routes/bulkUploadRoutes.js';
import excelRoutes from './Routes/excelRoutes.js';
import sendMailRoutes from './Routes/sendinimation.js'

import cugDetails from './Routes/cugDetailsRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const uploadsDir = path.resolve('uploads');


const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(fileUpload());






if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });  
    console.log(`Uploads directory created at: ${uploadsDir}`);
  } catch (error) {
    console.error(`Error creating uploads directory: ${error.message}`);
    process.exit(1);  
  }
} else {
  console.log(`Uploads directory already exists at: ${uploadsDir}`);
}



connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server due to database connection error:', err);
    });




    
// Routes
app.use('/api/auth', authRoutes);

//Region&Branch Routes
app.use('/api', regionRoutes);
app.use('/api', branchRoutes);

app.use('/api/v1/login-types', loginTypeRoutes);
app.use('/api/v1', userRoutes);///////////////////1
app.use('/api/requests', requestsRoutes);
app.use('/api',authenticateJWT, submitRoutes);
app.use('/api', hrRoutes );
app.use('/api/employees', employeeRoutes);
app.use('/api/employee', usersRoutes);
app.use('/api', requestinit);
app.use('/api/v1',deactivationRequestsRoutes);
app.use('/api',deactivateSubmitRoutes);
app.use('/api/v1', swaprequestRoutes);
app.use('/api', ongoingRequestRoutes);

//Count Routes
app.use('/api', countRequestsRoutes);
app.use('/api', dashboardCountRoutes);

app.use('/api', swapinitRoutes);
app.use('/api', swapSubmitRoutes);
app.use('/api', handleSimRequest);
app.use('/api/v1', bulkUploadRoutes);
app.use('/api', excelRoutes);
app.use('/api/v1',sendMailRoutes);

app.use('/api/v1', cugDetails);



