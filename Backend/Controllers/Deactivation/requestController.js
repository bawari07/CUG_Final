import { sql, poolPromise } from '../../Database/db.js';

export const deactivationpendingRequests = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .execute('sp_deactivationRequets');  

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
