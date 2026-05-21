import { sql, poolPromise } from '../../Database/db.js';

export const swapSubmitReq = async (req, res) => {
    const { requestID, employeeCode, rechargePlan ,remarksByIT} = req.body;
    const reqCompletedBY = req.user ? req.user.employeeCode : null;

    if (!requestID || !employeeCode  || !rechargePlan || !remarksByIT) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            // Update request status to 'Completed'
            const updateRequestStatusQuery = `
                UPDATE SIMRequest
                SET requestStatus = 'Completed'
                WHERE requestID = @requestID AND requestStatus = 'Pending';
            `;
            const updateResult = await transaction.request()
                .input('requestID', sql.Int, requestID)
                .query(updateRequestStatusQuery);

            if (updateResult.rowsAffected[0] === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Request not found or already completed' });
            }

            // Update SIM request data
            const updateSimRequestDataQuery = `
                UPDATE SIMRequest
                SET requestCompletedBy = @requestCompletedBy, 
                    requestCompletedDate = GETDATE(),
                    rechargePlan = @rechargePlan,
                    remarksByIT = @remarksByIT
                WHERE requestID = @requestID;
            `;
            await transaction.request()
                .input('requestID', sql.Int, requestID)
                .input('rechargePlan', sql.VarChar, rechargePlan)
                .input('requestCompletedBy', sql.VarChar, reqCompletedBY)
                .input('remarksByIT', sql.VarChar, remarksByIT)
                .query(updateSimRequestDataQuery);

            // Select cugNumber from SIMRequest table
            const selectCugNumberQuery = `
                SELECT cugNumber
                FROM SIMRequest
                WHERE requestID = @requestID;
            `;
            const selectResult = await transaction.request()
                .input('requestID', sql.Int, requestID)
                .query(selectCugNumberQuery);

            if (selectResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'CUG Number not found for this request' });
            }

            const { cugNumber } = selectResult.recordset[0];

            // Step 1: Free up the OLD ICCID/IMSI (reset cugNumber to NULL in SimCardsMaster)
            const resetOldSimCardQuery = `
                UPDATE SimCardsMaster
                SET cugNumber = NULL,
                    rechargePlan = NULL,
                    updatedDate = GETDATE()
                WHERE cugNumber = @cugNumber;
            `;
            await transaction.request()
                .input('cugNumber', sql.VarChar, cugNumber)
                .query(resetOldSimCardQuery);

            // Step 2: Get the new ICCID from the current request
            const selectNewIccidQuery = `
                SELECT iccidNumber
                FROM SIMRequest
                WHERE requestID = @requestID;
            `;
            const newIccidResult = await transaction.request()
                .input('requestID', sql.Int, requestID)
                .query(selectNewIccidQuery);

            if (newIccidResult.recordset.length === 0 || !newIccidResult.recordset[0].iccidNumber) {
                await transaction.rollback();
                return res.status(404).json({ message: 'New ICCID Number not found for this swap request' });
            }

            const { iccidNumber: newIccidNumber } = newIccidResult.recordset[0];

            // Step 3: Update the NEW ICCID/IMSI with the CUG number
            const updateNewSimCardQuery = `
                UPDATE SimCardsMaster
                SET cugNumber = @cugNumber,
                    rechargePlan = @rechargePlan,
                    updatedDate = GETDATE()
                WHERE iccidNumber = @iccidNumber;
            `;
            await transaction.request()
                .input('cugNumber', sql.VarChar, cugNumber)
                .input('rechargePlan', sql.VarChar, rechargePlan)
                .input('iccidNumber', sql.VarChar, newIccidNumber)
                .query(updateNewSimCardQuery);

            // Step 4: Update existing SIMAssignment (that was marked as 'Reassigned' during init)
            const updateSimAssignmentQuery = `
                UPDATE SIMAssignments
                SET status = 'Active',
                    employeeCode = @employeeCode,
                    assignedDate = GETDATE(),
                    requestID = @requestID
                WHERE cugNumber = @cugNumber
                AND status = 'Reassigned';
            `;
            const updateAssignmentResult = await transaction.request()
                .input('employeeCode', sql.VarChar, employeeCode)
                .input('requestID', sql.Int, requestID)
                .input('cugNumber', sql.VarChar, cugNumber)
                .query(updateSimAssignmentQuery);

            if (updateAssignmentResult.rowsAffected[0] === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'No reassigned SIM assignment found to update' });
            }

            // Commit transaction
            await transaction.commit();
            res.status(200).json({ message: 'Data stored and updated successfully' });
        } catch (err) {
            await transaction.rollback();
            res.status(500).json({ message: 'Transaction error', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database connection error', error: err.message });
    }
};
