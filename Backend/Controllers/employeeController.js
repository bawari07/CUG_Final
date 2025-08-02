import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();




export const fetchEmployeeData = async (req, res) => {


    const { employeeCode } = req.params;

    const requestBody = {
        employeeCode,
        fromCreatedDate: "2011-07-01",
        toCreatedDate: "2040-07-03",
        pagination: {
            pageNumber: 1,
            pageSize: 10000
        }
    };

    try {
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

        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch employee data:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            console.error('No response received:', error.request);
            res.status(500).json({ error: 'No response received from HROne API' });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({ error: 'Unexpected error occurred' });
        }
    }
};
