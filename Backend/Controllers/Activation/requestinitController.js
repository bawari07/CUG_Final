import { sql } from '../../Database/db.js';

export const requestinit = async (req, res) => {
    const { requestID, iccidNumber, imsiNumber, telecomPartner } = req.body;
    const updatedByEmployeeCode = req.user?.employeeCode;

    // Validate inputs
    if (!requestID || !iccidNumber || !imsiNumber || !telecomPartner) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!updatedByEmployeeCode) {
        return res.status(401).json({ message: 'User not authenticated or employee code missing' });
    }

    try {
        const pool = await sql.connect();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const updateResult = await transaction.request()
                .input('requestID', sql.Int, requestID)
                .input('iccidNumber', sql.VarChar(50), iccidNumber)
                .input('imsiNumber', sql.VarChar(50), imsiNumber)
                .input('telecomPartner', sql.VarChar(50), telecomPartner)
                .input('updatedByEmployeeCode', sql.VarChar(50), updatedByEmployeeCode)
                .execute('requestInit');

            // Check if any row was updated
            if (updateResult.returnValue === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Request not found or already ongoing' });
            }

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
