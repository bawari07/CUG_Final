import { sql, poolPromise } from '../Database/db.js';

export const countRequests = async (req, res) => {
    const { type,region } = req.query; 

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('type', sql.VarChar, type) 
            .input('region', sql.VarChar, region) 
            .execute('sp_countPendingRequests'); 

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No pending requests found' });
        }

        res.status(200).json(result.recordsets);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
