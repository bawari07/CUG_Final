import axios from 'axios';
import { sql } from '../../Database/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const swapinitRequest = async (req, res) => {
    const { employeeCode, oldUserCugNumber, oldUserEmployeeCode, remarksByHR, action, iccidNumber, imsiNumber, simId } = req.body;
    const requestedByEmployeeCode = req.user ? req.user.employeeCode : null;

    if (!employeeCode || !oldUserCugNumber || !oldUserEmployeeCode || !requestedByEmployeeCode || !remarksByHR) {
        return res.status(400).json({ message: 'Employee code, oldUserCugNumber, oldUserEmployeeCode, and requestedByEmployeeCode are required' });
    }

    try {
        // Fetch employee data from API
        const requestBody = {
            employeeCode,
            fromCreatedDate: "2011-07-01",
            toCreatedDate: "2040-07-03",
            pagination: {
                pageNumber: 1,
                pageSize: 10000
            }
        };

        const response = await axios.post(
            'https://hronemanagedapi.hrone.cloud/production/api/external/employees',
            requestBody,
            {
                headers: {
                    'domainCode': process.env.HRONE_DOMAIN_CODE,
                    'apiKey': process.env.HRONE_API_KEY,
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.HRONE_SUBSCRIPTION_KEY,
                    'userId': process.env.HRONE_USER_ID
                }
            }
        );

        if (response.status === 200 && response.data) {
            const employeeInfo = response.data.employeeInfo[0];

            // Extract required details from the employee data
            const {
                'first name': firstName = 'Unknown',
                'last name': lastName = 'Unknown',
                'department': department = 'Unknown',
                'personal Contact Number': personalNumber = 'Unknown',
                'personal email': personalEmail = 'Unknown',
                'date of birth': dateOfBirth = null,
                'designation': designation = 'Unknown',
                'region': region = 'Unknown',
                'branches': branchLocation = 'Unknown',
                'aadhar no.': aadharCardNumber = 'Unknown',
                'pan no.': panCardNumber = 'Unknown',
                'permanent Address': homeAddress = 'Unknown',
            } = employeeInfo;

            const employeeName = `${firstName} ${lastName}`;

            // Validate and format dob
            const validDob = dateOfBirth && !isNaN(Date.parse(dateOfBirth)) 
            ? new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(dateOfBirth)).split('/').reverse().join('-') 
            : null;
            // Connect to the database
            const pool = await sql.connect();
            const transaction = new sql.Transaction(pool);

            try {
                await transaction.begin();

                // Update SIMAssignment table
                const updateSimAssignmentQuery = `
                    UPDATE SIMAssignments
                    SET status = 'Reassigned',
                        reassignedDate = GETDATE()
                    WHERE employeeCode = @oldUserEmployeeCode
                    AND cugNumber = @oldUserCugNumber;
                `;

                const updateRequest = new sql.Request(transaction);
                await updateRequest
                    .input('oldUserEmployeeCode', sql.VarChar, oldUserEmployeeCode)
                    .input('oldUserCugNumber', sql.VarChar, oldUserCugNumber)
                    .query(updateSimAssignmentQuery);

                // Select telecomPartner from SIMRequest table
                const selectTelecomPartnerQuery = `
                    SELECT telecomPartner
                    FROM SIMRequest
                    WHERE employeeCode = @oldUserEmployeeCode
                    AND cugNumber = @oldUserCugNumber;
                `;

                const selectTelecomPartnerRequest = new sql.Request(transaction);
                const selectTelecomPartnerResult = await selectTelecomPartnerRequest
                    .input('oldUserEmployeeCode', sql.VarChar, oldUserEmployeeCode)
                    .input('oldUserCugNumber', sql.VarChar, oldUserCugNumber)
                    .query(selectTelecomPartnerQuery);

                if (selectTelecomPartnerResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: 'Telecom partner not found for this request' });
                }

                const { telecomPartner } = selectTelecomPartnerResult.recordset[0];

                // Insert SIM request into database
                const insertSimRequestQuery = `
                    INSERT INTO SIMRequest 
                        (employeeCode, employeeName, department, personalNumber, personalEmail, DOB, designation, region, branchLocation, aadharCardNumber, panCardNumber, homeAddress, requestedBy, oldUserCugNumber, oldUserEmployeeCode, SIMALLOCATIONTYPE, requestType, requestStatus, cugNumber, telecomPartner, remarksByHR, action, iccidNumber, imsiNumber) 
                    VALUES 
                        (@employeeCode, @employeeName, @department, @personalNumber, @personalEmail, @dob, @designation, @region, @branchLocation, @aadharCardNumber, @panCardNumber, @homeAddress, @requestedBy, @oldUserCugNumber, @oldUserEmployeeCode, 'SwapSIM', 'Activation', 'Pending', @cugNumber, @telecomPartner, @remarksByHR, @action, @iccidNumber, @imsiNumber);
                `;

                const insertRequest = new sql.Request(transaction);
                await insertRequest
                    .input('employeeCode', sql.VarChar, employeeCode)
                    .input('employeeName', sql.VarChar, employeeName)
                    .input('department', sql.VarChar, department)
                    .input('personalNumber', sql.VarChar, personalNumber)
                    .input('personalEmail', sql.VarChar, personalEmail)
                    .input('dob', sql.Date, validDob)
                    .input('designation', sql.VarChar, designation)
                    .input('region', sql.VarChar, region)
                    .input('branchLocation', sql.VarChar, branchLocation)
                    .input('aadharCardNumber', sql.VarChar, aadharCardNumber)
                    .input('panCardNumber', sql.VarChar, panCardNumber)
                    .input('homeAddress', sql.VarChar, homeAddress)
                    .input('requestedBy', sql.VarChar, requestedByEmployeeCode)
                    .input('oldUserCugNumber', sql.VarChar, oldUserCugNumber)
                    .input('oldUserEmployeeCode', sql.VarChar, oldUserEmployeeCode)
                    .input('cugNumber', sql.VarChar, oldUserCugNumber)
                    .input('telecomPartner', sql.VarChar, telecomPartner)
                    .input('remarksByHR', sql.VarChar, remarksByHR)
                    .input('action', sql.VarChar, action || null)
                    .input('iccidNumber', sql.VarChar, iccidNumber || null)
                    .input('imsiNumber', sql.VarChar, imsiNumber || null)
                    .query(insertSimRequestQuery);

                await transaction.commit();

                res.status(201).json({ message: 'SIM request created successfully and SIM assignment updated' });
            } catch (transactionError) {
                await transaction.rollback();
                console.error('Transaction error:', transactionError);
                res.status(500).json({ error: 'Failed to create SIM request and update SIM assignment', details: transactionError.message });
            }
        } else {
            return res.status(500).json({ message: 'Failed to fetch employee data' });
        }
    } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Unexpected error occurred', details: err.message });  
    }
};
