import { sql, poolPromise } from '../Database/db.js';
import { sendEmail } from '../Services/emailService.js';

export const handleSimRequest = async (req, res) => {
    const {
        requestType, region, department, employeeCode, employeeName,
        personalNumber, personalEmail, workEmail, dob, designation,
        branchLocation, aadharCardNumber, panCardNumber, homeAddress, remarksByHR ,specialNumber
    } = req.body;

    const requestedByEmployeeCode = req.user?.employeeCode;

    if (!requestedByEmployeeCode) {
        return res.status(401).json({ message: 'User not authenticated or employee code missing' });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Query to check existing request count
        const checkExistingRequestCountQuery = `
            SELECT COUNT(*) AS count
            FROM SIMRequest
            WHERE employeeCode = @employeeCode
            AND requestType = @requestType;
        `;

        // Query to fetch request status
        const checkExistingRequestStatusQuery = `
            SELECT TOP 1 requestStatus
            FROM SIMRequest
            WHERE employeeCode = @employeeCode
            AND requestType = @requestType
            ORDER BY requestedDate DESC; 
        `;

        // Check if there are any existing requests
        const countResult = await request.input('employeeCode', sql.VarChar, employeeCode)
            .input('requestType', sql.VarChar, requestType)
            .query(checkExistingRequestCountQuery);

        const count = countResult.recordset[0]?.count;

        let requestStatus = null;
        if (count > 0) {
            // Fetch the request status if any request exists
            const statusResult = await request.query(checkExistingRequestStatusQuery);
            requestStatus = statusResult.recordset[0]?.requestStatus;
        }

        // If a similar request exists and is not rejected
        if (count > 0 && requestStatus !== 'Rejected') {
            return res.status(400).json({
                message: 'A similar request already exists and is not rejected. Please update the existing request.'
            });
        }

        // Insert or update the SIM request
        const [simRequestResult, emailResult] = await Promise.all([
            pool.request()
                .input('requestType', sql.VarChar, requestType)
                .input('region', sql.VarChar, region)
                .input('department', sql.VarChar, department)
                .input('employeeCode', sql.VarChar, employeeCode)
                .input('employeeName', sql.VarChar, employeeName)
                .input('personalNumber', sql.VarChar, personalNumber)
                .input('personalEmail', sql.VarChar, personalEmail)
                .input('workEmail', sql.VarChar, workEmail || null)
                .input('dob', sql.Date, dob)
                .input('designation', sql.VarChar, designation)
                .input('branchLocation', sql.VarChar, branchLocation)
                .input('aadharCardNumber', sql.VarChar, aadharCardNumber || null)
                .input('panCardNumber', sql.VarChar, panCardNumber || null)
                .input('homeAddress', sql.VarChar, homeAddress)
                .input('requestedBy', sql.VarChar, requestedByEmployeeCode)
                .input('remarksByHR', sql.VarChar, remarksByHR)
                .input('specialNumber', sql.Bit, specialNumber)
                .execute('HandleSIMRequest'),
            pool.request()
                .input('employeeCode', sql.VarChar, requestedByEmployeeCode)
                .query(`
                    SELECT email
                    FROM Employees
                    WHERE regionName = (SELECT regionName FROM Employees WHERE employeeCode = @employeeCode)
                    AND roleName = 'IT'
                `),
        ]);

        const statusMessage = simRequestResult.recordset[0]?.StatusMessage;

        // Extract emails of IT employees to notify
        const itEmployeeEmails = emailResult.recordset
            .filter(row => row.email)
            .map(row => row.email);

        console.log('Emails to notify:', itEmployeeEmails);

        if (itEmployeeEmails.length > 0) {
            sendNotifications(itEmployeeEmails, employeeName, employeeCode).catch(err => {
                console.error('Failed to send notifications:', err);
            });
        }

        // Handle specific cases based on the status message
        if (['User already has a CUG SIM.', 'No active SIM assigned to this user or the SIM is already deactivated or suspended.'].includes(statusMessage)) {
            return res.status(400).json({ message: statusMessage });
        }

        return res.status(201).json({ message: statusMessage });
    } catch (err) {
        console.error('Error processing SIM request:', err);
        return res.status(500).json({ message: 'Error processing SIM request' });
    }
};

// Utility function to send email notifications
const sendNotifications = async (itEmployeeEmails, employeeName, employeeCode) => {
    try {
        if (!Array.isArray(itEmployeeEmails)) {
            itEmployeeEmails = typeof itEmployeeEmails === 'string'
                ? itEmployeeEmails.split(',').map(email => email.trim())
                : [];
        }

        const emailOptions = {
            to: itEmployeeEmails.join(','),
            subject: 'New SIM Request Notification',
            text: `A new SIM request has been submitted for ${employeeName} (Employee Code: ${employeeCode}). Please review it as needed.`,
        };
        await sendEmail(emailOptions.to, emailOptions.subject, emailOptions.text);
    } catch (err) {
        console.error('Error in sendNotifications:', err);
        throw err;
    }
};
