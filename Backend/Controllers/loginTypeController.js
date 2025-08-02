import { sql, poolPromise } from '../Database/db.js';

export const getLoginTypes = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Roles');
        
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No login types found' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching login types:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
