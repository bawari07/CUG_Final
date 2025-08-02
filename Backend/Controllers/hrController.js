import { sql, poolPromise } from '../Database/db.js';

export const Hr = async (req, res) => {
    const { option } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        if (option) {
            request.input('option', sql.VarChar, option);
        } else {
            return res.status(400).json({ message: 'Option parameter is required' });
        }

        const result = await request.execute('sp_GetSIMRequests');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No data found for the selected option' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching SIM requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
