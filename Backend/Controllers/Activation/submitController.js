import { sql, poolPromise } from '../../Database/db.js';
import { sendEmail } from '../../Services/emailService.js';

export const submitSimRequest = async (req, res) => {
    const { requestID, cugNumber, rechargePlan, remarksByIT, isB2B, b2bRemark } = req.body;
    const requestCompletedByEmployeeCode = req.user?.employeeCode;

    if (!requestCompletedByEmployeeCode) {
        return res.status(401).json({ message: 'User not authenticated or employee code missing' });
    }

    if (!requestID || !cugNumber || !rechargePlan) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool); // Create a transaction

    try {
        await transaction.begin(); // Start the transaction

        // Step 1: Check if the request exists and is ongoing
        const checkRequestQuery = `
            SELECT requestStatus
            FROM SIMRequest
            WHERE requestID = @requestID;
        `;

        const requestStatusResult = await transaction.request()
            .input('requestID', sql.Int, requestID)
            .query(checkRequestQuery);

        const requestStatus = requestStatusResult.recordset[0]?.requestStatus;

        if (!requestStatus) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (requestStatus !== 'Ongoing') {
            return res.status(400).json({ message: 'Request is not in an ongoing state.' });
        }

        // Step 2: Update the SIM request status and details
        const updateSimRequestQuery = `
            UPDATE SIMRequest
            SET
                requestStatus = 'Completed',
                cugNumber = @cugNumber,
                rechargePlan = @rechargePlan,
                requestCompletedBy = @requestCompletedBy,
                remarksByIT = @remarksByIT,
                isB2B = @isB2B,
                b2bRemark = @b2bRemark,
                requestCompletedDate = GETDATE()
            WHERE requestID = @requestID;
        `;

        await transaction.request()
            .input('requestID', sql.Int, requestID)
            .input('cugNumber', sql.VarChar, cugNumber)
            .input('rechargePlan', sql.VarChar, rechargePlan)
            .input('requestCompletedBy', sql.VarChar, requestCompletedByEmployeeCode)
            .input('remarksByIT', sql.VarChar, remarksByIT)
            .input('isB2B', sql.Bit, isB2B != null ? (isB2B === true || isB2B === 'true' ? 1 : 0) : null)
            .input('b2bRemark', sql.VarChar, b2bRemark ?? null)
            .query(updateSimRequestQuery);

        // Step 3: Update SIM card data
        const updateSimCardQuery = `
            UPDATE SimCardsMaster
            SET 
                cugNumber = @cugNumber,
                rechargePlan = @rechargePlan,
                updatedDate = GETDATE()
            WHERE iccidNumber = (SELECT iccidNumber FROM SIMRequest WHERE requestID = @requestID);
        `;

        await transaction.request()
            .input('requestID', sql.Int, requestID)
            .input('cugNumber', sql.VarChar, cugNumber)
            .input('rechargePlan', sql.VarChar, rechargePlan)
            .query(updateSimCardQuery);

        // Step 4: Insert into SIMAssignments
        const insertSimAssignmentQuery = `
            INSERT INTO SIMAssignments (cugNumber, status, employeeCode, assignedDate, requestID)
            SELECT @cugNumber, 'Active', employeeCode, GETDATE(), @requestID
            FROM SIMRequest
            WHERE requestID = @requestID;
        `;

        await transaction.request()
            .input('requestID', sql.Int, requestID)
            .input('cugNumber', sql.VarChar, cugNumber)
            .query(insertSimAssignmentQuery);

        // Step 5: Fetch emails and send notifications asynchronously
        const fetchEmailsQuery = `
            SELECT SIMRequest.personalEmail AS employeeEmail,
                   Employees.email AS hrEmail,
                   department as department , 
				   region as region,
				   requestType as requestType,
				   Employees.employeeName AS hrName,
				   SIMRequest.employeeName AS employeeName,
				   SIMRequest.employeeCode AS employeeCode
            FROM SIMRequest
            JOIN Employees ON Employees.employeeCode = SIMRequest.requestedBy
            WHERE SIMRequest.requestID = @requestID;
        `;

        const emailDetailsResult = await transaction.request()
            .input('requestID', sql.Int, requestID)
            .query(fetchEmailsQuery);

        if (emailDetailsResult.recordset.length > 0) {
            const { employeeEmail, hrEmail, department, region, requestType,hrName,employeeName, employeeCode,} = emailDetailsResult.recordset[0];

            const emailSubject = `CUG SIM Collection Confirmation for ${employeeName} & Employee Code ${employeeCode}`;
            const emailBody = `
                <p>Dear ${hrName},</p>
                <p>This is to inform you that <strong>${employeeName}</strong>, Employee Code <strong>${employeeCode}</strong>,</p>
                <strong>Department:</strong> ${department}<br>
                <strong>Region:</strong> ${region}</p>
                <p>has successfully collected their CUG SIM on <strong>${new Date().toLocaleDateString()}</strong>. Please find the activation details below:</p>
                <ul>
                    <li><strong>Employee Name:</strong> ${employeeName}</li>
                    <li><strong>Employee Code:</strong> ${employeeCode}</li>
                    <li><strong>CUG Number:</strong> ${cugNumber}</li>
                    <li><strong>Request Type:</strong> ${requestType}</li>
                </ul>
                <p>Requesting you to update the number in the HRONE app.</p>
                <p>For any further details, please contact the IT department.</p>
                <p>Best Regards,<br>IT DEPARTMENT</p>
            `;

            // Send email asynchronously (in the background)
            sendEmail([hrEmail], emailSubject, emailBody).catch((error) => {
                console.error('Error sending email:', error);
            });
        }

        // Commit the transaction after all queries succeed
        await transaction.commit();

        // Send immediate response to the client
        return res.status(200).json({ message: 'Request completed successfully, and notifications sent in the background.' });

    } catch (err) {
        // If any error occurs, roll back the transaction
        await transaction.rollback();
        console.error('Error in submitSimRequest:', err);
        return res.status(500).json({ message: 'An error occurred while processing the request.', error: err.message });
    }
};
