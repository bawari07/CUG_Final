import { sql, poolPromise } from '../Database/db.js';

export const userList = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT employeeCode, employeeName, roleName, regionName, branchName, email, mobileNo, isActive
            FROM Employees
            WHERE roleName <> 'Admin';

        `);

        const users = result.recordset;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const toggleUserActivation = async (req, res) => {
    const { employeeCode } = req.params;
    const adminId = req.user ? req.user.employeeCode : null;  
    if (!employeeCode || !adminId) {
        return res.status(400).json({ message: 'Employee code and admin ID are required' });
    }

    try {
        const pool = await poolPromise;

        
        const userResult = await pool.request()
            .input('employeeCode', sql.VarChar, employeeCode)
            .query(`
                SELECT isActive, employeeId FROM Employees WHERE employeeCode = @employeeCode
            `);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentStatus = userResult.recordset[0].isActive;
        const employeeId = userResult.recordset[0].employeeId;
        const newStatus = currentStatus ? 0 : 1;

        // Update user activation status
        const updateResult = await pool.request()
            .input('employeeCode', sql.VarChar, employeeCode)
            .input('newStatus', sql.Bit, newStatus)
            .query(`
                UPDATE Employees
                SET isActive = @newStatus
                WHERE employeeCode = @employeeCode
            `);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the activation/deactivation
        const ipAddress = req.headers['x-forwarded-for'] || req.ip;
        await pool.request()
            .input('employeeId', sql.Int, employeeId)
            .input('adminId', sql.Int, adminId)
            .input('ipAddress', sql.VarChar(50), ipAddress)
            .input('previousIsActive', sql.Bit, currentStatus)
            .input('newIsActive', sql.Bit, newStatus)
            .query(`
                INSERT INTO UserLogs (employeeId, activityType, timestamp, ipAddress, performedById, previousIsActive, newIsActive)
                VALUES (@employeeId, 'ToggleActivation', GETDATE(), @ipAddress, @adminId, @previousIsActive, @newIsActive)
            `);

        const statusMessage = newStatus ? 'User activated successfully' : 'User deactivated successfully';
        res.status(200).json({ message: statusMessage });
    } catch (error) {
        console.error('Error toggling user activation:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
