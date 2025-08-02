import { sql, poolPromise } from '../Database/db.js';

export const getBranchesByRegion = async (req, res) => {

    const region = req.params.region;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        const result = await request
            .input('region', sql.VarChar, region)
            .execute('GetBranchesByRegion');

        res.json(result.recordset);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('Server Error');
    }
};

