import { sql, poolPromise } from '../Database/db.js';

export const pendingRequests = async (req, res) => {
    const { simAllocationType, type , status } = req.query; 

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('simAllocationType', sql.VarChar, simAllocationType ) 
            .input('status', sql.VarChar, status) 
            .input('type', sql.VarChar, type) 
            .execute('GetPendingRequests'); 

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'No pending requests found' });
        }

        // For SwapSIM requests, fetch the correct ICCID/IMSI from SIMRequest table
        if (simAllocationType === 'SwapSim' || simAllocationType === 'SwapSIM') {
            const swapRequests = result.recordset;
            
            for (let request of swapRequests) {
                if (request.requestID) {
                    const swapDetailsQuery = `
                        SELECT iccidNumber, imsiNumber, telecomPartner, action 
                        FROM SIMRequest 
                        WHERE requestID = @requestID;
                    `;
                    
                    const swapResult = await pool.request()
                        .input('requestID', sql.Int, request.requestID)
                        .query(swapDetailsQuery);
                    
                    if (swapResult.recordset && swapResult.recordset.length > 0) {
                        // Override with the NEW ICCID/IMSI, telecomPartner, and action from SIMRequest
                        request.ICCIDNumber = swapResult.recordset[0].iccidNumber;
                        request.IMSINumber = swapResult.recordset[0].imsiNumber;
                        request.telecomPartner = swapResult.recordset[0].telecomPartner;
                        request.action = swapResult.recordset[0].action;
                    }
                }
            }
        } else {
            // For all other request types (NewSim, etc.), fetch ICCID/IMSI from SimCardsMaster
            const requests = result.recordset;
            
            for (let request of requests) {
                if (request.requestID) {
                    // First, get iccidNumber from SIMRequest
                    const simRequestQuery = `
                        SELECT iccidNumber, telecomPartner 
                        FROM SIMRequest 
                        WHERE requestID = @requestID;
                    `;
                    
                    const simRequestResult = await pool.request()
                        .input('requestID', sql.Int, request.requestID)
                        .query(simRequestQuery);
                    
                    if (simRequestResult.recordset && simRequestResult.recordset.length > 0) {
                        const iccidFromRequest = simRequestResult.recordset[0].iccidNumber;
                        const telecomPartnerFromRequest = simRequestResult.recordset[0].telecomPartner;
                        
                        // If telecomPartner is missing, update it
                        if (!request.telecomPartner && telecomPartnerFromRequest) {
                            request.telecomPartner = telecomPartnerFromRequest;
                        }
                        
                        // Fetch ICCID and IMSI from SimCardsMaster using the iccidNumber
                        if (iccidFromRequest) {
                            const simMasterQuery = `
                                SELECT iccidNumber, imsiNumber 
                                FROM SimCardsMaster 
                                WHERE iccidNumber = @iccidNumber;
                            `;
                            
                            const simMasterResult = await pool.request()
                                .input('iccidNumber', sql.VarChar, iccidFromRequest)
                                .query(simMasterQuery);
                            
                            if (simMasterResult.recordset && simMasterResult.recordset.length > 0) {
                                request.ICCIDNumber = simMasterResult.recordset[0].iccidNumber;
                                request.IMSINumber = simMasterResult.recordset[0].imsiNumber;
                            }
                        }
                    }
                }
            }
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
