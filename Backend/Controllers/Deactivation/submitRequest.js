import { sql, poolPromise } from '../../Database/db.js';
import { sendEmail } from '../../Services/emailService.js';  

export const submitSimRequest = async (req, res) => {
    const { requestID, remarksByIT } = req.body;
    const requestCompletedByEmployeeCode = req.user ? req.user.employeeCode : null;

    if (!requestID || !remarksByIT) {
        return res.status(400).json({ message: 'Request ID and Proof Document are required' });
    }

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const request = transaction.request();

            const getEmployeeCodeQuery = `
                SELECT employeeCode, requestType
                FROM SIMRequest
                WHERE requestID = @requestID;
            `;
            request.input('requestID', sql.Int, requestID);
            const employeeResult = await request.query(getEmployeeCodeQuery);

            if (employeeResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Request not found' });
            }

            const { employeeCode, requestType } = employeeResult.recordset[0];

            const getSimNumberQuery = `
                SELECT cugNumber
                FROM SIMAssignments
                WHERE employeeCode = @employeeCode 
                AND deactivatedDate IS NULL;
            `;
            request.input('employeeCode', sql.VarChar, employeeCode);
            const simResult = await request.query(getSimNumberQuery);

            if (simResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'SIM not found for the given employee' });
            }

            const simNumber = simResult.recordset[0].cugNumber;

            let updateSimQuery = '';
            if (requestType === 'Deactivation') {
                updateSimQuery = `
                    UPDATE SIMAssignments
                    SET status = 'Deactivated', deactivatedDate = GETDATE()
                    WHERE employeeCode = @employeeCode;
                `;
            } else if (requestType === 'Suspension') {
                updateSimQuery = `
                    UPDATE SIMAssignments
                    SET status = 'Suspended', suspendedDate = GETDATE()
                    WHERE employeeCode = @employeeCode;
                `;
            } else {
                await transaction.rollback();
                return res.status(400).json({ message: 'Invalid request type' });
            }

            await request.query(updateSimQuery);

            const updateSimRequestQuery = `
                UPDATE SIMRequest
                SET remarksByIT = @remarksByIT,
                    requestCompletedDate = GETDATE(),
                    requestCompletedBy = @requestCompletedBy, 
                    requestStatus = 'Completed'
                WHERE requestID = @requestID;
            `;
            request.input('remarksByIT', sql.VarChar, remarksByIT);
            request.input('requestCompletedBy', sql.VarChar, requestCompletedByEmployeeCode);
            await request.query(updateSimRequestQuery);

            const emailResult = await pool.request()
                .input('employeeCode', sql.VarChar, requestCompletedByEmployeeCode)
                .query(`
                    SELECT email
                    FROM Employees
                    WHERE regionName = (SELECT regionName FROM Employees WHERE employeeCode = @employeeCode)
                    AND roleName = 'HR'
                `);

            const itEmployeeEmails = emailResult.recordset
                .filter(row => row.email)
                .map(row => row.email);

            if (itEmployeeEmails.length > 0) {
                sendNotifications(itEmployeeEmails, employeeCode, simNumber).catch(err => {
                    console.error('Failed to send notifications:', err);
                });
            }

            await transaction.commit();
            res.status(200).json({ message: 'SIM request processed successfully' });

        } catch (err) {
            await transaction.rollback();
            res.status(500).json({ message: 'Transaction error', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database connection error', error: err.message });
    }
};

const sendNotifications = async (itEmployeeEmails, employeeCode, simNumber) => {
    try {
        const emailOptions = {
            to: itEmployeeEmails.join(','),  
            subject: 'SIM Request Processed',
            text: `The SIM request for Employee Code: ${employeeCode} has been processed. SIM Number: ${simNumber}. Please take the necessary actions as needed.`,
        };

        await sendEmail(emailOptions.to, emailOptions.subject, emailOptions.text);
    } catch (err) {
        console.error('Error in sendNotifications:', err);
        throw err;  
    }
};
