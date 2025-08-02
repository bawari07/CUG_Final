import { sql, poolPromise } from '../Database/db.js';

export const getAllCugDeatails = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT iccidNumber 
            FROM SimCardsMaster scm
            WHERE scm.cugNumber IS NULL
            AND NOT EXISTS (
            SELECT 1 
            FROM SIMRequest sr 
            WHERE sr.iccidNumber = scm.iccidNumber
            )
        `);

        const CugDeatails = result.recordsets;

        if (!CugDeatails || CugDeatails.length === 0) {
            return res.status(404).json({ message: 'No Avaliable CUG' });
        }

        res.status(200).json(CugDeatails);
    } catch (err) {
        console.error('Error fetching regions:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const GetCugDetails = async (req, res) => {

    const iccidNumber = req.params.iccidNumber;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        const result = await request
            .input('iccidNumber', sql.VarChar, iccidNumber)
            .execute('GetCugDetails');

        res.json(result.recordset);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('Server Error');
    }
};