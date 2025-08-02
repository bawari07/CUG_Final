import { sql, poolPromise } from '../Database/db.js';
import { sendEmail } from '../Services/emailService.js';

export const sendIntimation = async (req, res) => {
    const { requestID } = req.body;
    const requestCompletedByEmployeeCode = req.user?.employeeCode;

    if (!requestCompletedByEmployeeCode) {
        return res.status(401).json({ message: 'User not authenticated or employee code missing' });
    }

    if (!requestID) {
        return res.status(400).json({ message: 'Request ID is required.' });
    }

    try {
        const pool = await poolPromise;

        // Fetch the necessary details in one optimized query
        const fetchDetailsQuery = `
            SELECT 
                SIMRequest.personalEmail AS employeeEmail,
                Employees.email AS hrEmail
            FROM SIMRequest
            INNER JOIN Employees ON Employees.employeeCode = SIMRequest.requestedBy
            WHERE SIMRequest.requestID = @requestID;
        `;

        const { recordset } = await pool.request()
            .input('requestID', sql.Int, requestID)
            .query(fetchDetailsQuery);

        if (recordset.length === 0) {
            return res.status(404).json({ message: 'Request details not found.' });
        }

        const { employeeEmail, hrEmail } = recordset[0];

        // Build email content
        const emailSubject = `Your CUG SIM is Ready for Collection`;
        const emailBody = `
            <p>Dear Employee,</p>
            <p>It is to inform you that your CUG (Closed User Group) SIM card is now ready for collection. 
            Please visit the IT Department to collect your SIM.</p>
            <p>For further details, please contact your HR (${hrEmail}).</p>
        `;

        // Call the email sending function asynchronously without awaiting it
        sendEmail([employeeEmail, hrEmail], emailSubject, emailBody)
            .catch((error) => {
                console.error('Error sending email:', error);
            });

        // Send the response immediately while the email is being processed in the background
        return res.status(200).json({
            message: 'Notification sent successfully, email is being processed.'
        });
    } catch (error) {
        console.error('Error in sendIntimation:', error);
        return res.status(500).json({
            message: 'An error occurred while processing the request.',
            error: error.message
        });
    }
};
