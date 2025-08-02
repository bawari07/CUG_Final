import { sql, poolPromise } from '../Database/db.js';

export const approveSimRequest = async (req, res) => {
    const { employeeCode, requestType, action , approvalRemarks } = req.body;

    const actionByEmployeeCode = req.user?.employeeCode; 
    if (!employeeCode || !requestType || !action || !approvalRemarks) {
        return res.status(400).json({ message: 'Employee Code, Request Type, and Action (Approve/Deny) are required' });
    }

    if (!actionByEmployeeCode) {
        return res.status(401).json({ message: 'User not authenticated or employee code missing' });
    }


    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Update the request status based on the action
        const updateRequestQuery = `
            UPDATE SIMRequest
            SET requestStatus = @action, 
                actionBy = @actionBy, 
                approvalRemarks = @approvalRemarks,
                updatedAt = GETDATE()
            WHERE employeeCode = @employeeCode 
              AND requestType = @requestType;
        `;

        request.input('employeeCode', sql.VarChar, employeeCode);
        request.input('requestType', sql.VarChar, requestType);
        request.input('action', sql.VarChar, action === 'Approve' ? 'Pending' : 'Rejected');
        request.input('approvalRemarks', sql.VarChar, approvalRemarks);
        request.input('actionBy', sql.VarChar, actionByEmployeeCode);

        const updateResult = await request.query(updateRequestQuery);

        // Check if any rows were updated
        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No matching request found to update' });
        }

        return res.status(200).json({ 
            message: `Request successfully ${action === 'Approve' ? 'approved and set to pending' : 'denied and set to rejected'}` 
        });
    } catch (error) {
        console.error('Error processing SIM request:', error);
        return res.status(500).json({ message: 'Error processing SIM request', error: error.message });
    }
};
