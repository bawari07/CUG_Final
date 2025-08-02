import { sql, poolPromise } from '../Database/db.js';

export const saveTelecomData = async (req, res) => {
    const {  iccidNumber, imsiNumber, telecomPartner , telecomCircle} = req.body;
    const insertedBy = req.user ? req.user.employeeCode : null;

    if (!iccidNumber || !imsiNumber || !telecomPartner || !telecomCircle ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OperationType', sql.VarChar, 'INSERT')
            .input('iccidNumber', sql.VarChar, iccidNumber)
            .input('imsiNumber', sql.VarChar, imsiNumber)
            .input('telecomPartner', sql.VarChar, telecomPartner)
            .input('insertedBy', sql.VarChar, insertedBy)
            .input('telecomCircle', sql.VarChar, telecomCircle)
            .execute('InsertTelecomData');

        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getDetails = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OperationType', sql.VarChar, 'SELECT')
            .execute('InsertTelecomData');
        
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No Details found' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateSimCardDetails = async (req, res) => {
    const { iccidNumber, imsiNumber, cugNumber, rechargePlan , employeeCode } = req.body;
    const insertedBy = req.user ? req.user.employeeCode : null;

    if (!iccidNumber || !imsiNumber || !cugNumber || !rechargePlan || !employeeCode) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OperationType', sql.VarChar, 'UPDATE')
            .input('iccidNumber', sql.VarChar, iccidNumber)
            .input('imsiNumber', sql.VarChar, imsiNumber)
            .input('cugNumber', sql.VarChar, cugNumber)
            .input('rechargePlan', sql.VarChar, rechargePlan)
            .input('employeeCode', sql.VarChar, employeeCode)
            .input('insertedBy', sql.VarChar, insertedBy)
            .execute('InsertTelecomData');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No matching record found to update' });
        }

        res.status(200).json({ message: 'SIM card details updated successfully' });
    } catch (error) {
        
        if (error.originalError && error.originalError.info) {
            const sqlErrorMessage = error.originalError.info.message;
            return res.status(500).json({ message: 'SQL Server error', error: sqlErrorMessage });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};
