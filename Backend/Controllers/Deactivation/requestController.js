import { sql, poolPromise } from '../../Database/db.js';

export const deactivationpendingRequests = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .execute('sp_deactivationRequets');  

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No deactivation requests found' });
        }

        // Fetch telecomPartner for each request if not already present
        const requests = result.recordset;
        
        for (let request of requests) {
            if (request.requestID && !request.telecomPartner) {
                const telecomQuery = `
                    SELECT telecomPartner 
                    FROM SIMRequest 
                    WHERE requestID = @requestID;
                `;
                
                const telecomResult = await pool.request()
                    .input('requestID', sql.Int, request.requestID)
                    .query(telecomQuery);
                
                if (telecomResult.recordset && telecomResult.recordset.length > 0) {
                    request.telecomPartner = telecomResult.recordset[0].telecomPartner;
                }
            }
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
