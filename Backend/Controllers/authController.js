import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sql } from '../Database/db.js';

export const login = async (req, res) => {
    const { employeeCode, password } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Employees WHERE employeeCode = ${employeeCode}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid employee code or password' });
        }

        if (!user.isActive ) {
            return res.status(403).json({ message: 'Account is inactive. Please contact the administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid employee code or password' });
        }

        const payload = {
            employeeCode: user.employeeCode,
            roleName: user.roleName,
            regionName: user.regionName
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            token,
            roleName: user.roleName,
            regionName: user.regionName
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
