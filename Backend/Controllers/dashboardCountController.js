import { sql, poolPromise } from '../Database/db.js';

export const dashboardCount = async (req, res) => {
    const { region } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('region', sql.VarChar, region)
            .execute('sp_dashboardcount');
        res.status(200).json(result.recordsets);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};
