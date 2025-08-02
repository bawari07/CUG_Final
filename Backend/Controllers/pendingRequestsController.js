import { sql, poolPromise } from '../Database/db.js';

export const pendingRequests = async (req, res) => {
    const { simAllocationType, type , status } = req.query; 

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('simAllocationType', sql.VarChar, simAllocationType ) 
            .input('status', sql.VarChar, status) 
            .input('type', sql.VarChar, type) 
            .execute('GetPendingRequests'); 

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No pending requests found' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
