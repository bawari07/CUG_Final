import { sql, poolPromise } from '../Database/db.js';

export const getAllRegions = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT  distinct REGION FROM RegionMaster
        `);

        const regions = result.recordset;

        if (!regions || regions.length === 0) {
            return res.status(404).json({ message: 'No regions found' });
        }

        res.status(200).json(regions);
    } catch (err) {
        console.error('Error fetching regions:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
