import { sql, poolPromise } from '../Database/db.js';

export const getApprovalRequests = async (req, res) => {

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .execute('sp_getApprovalRequest'); 

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No pending requests found' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
