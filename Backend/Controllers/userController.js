import { sql, poolPromise } from '../Database/db.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  const { password, region, employeeCode, branch, employeeName, loginType, email, mobileNo } = req.body;

  // Check for missing fields
  if (!password || !region || !employeeCode || !branch || !employeeName || !loginType || !email || !mobileNo) {
    return res.status(400).json({ message: 'All fields are required' });
  }

    const createdByEmployeeCode = req.user ? req.user.employeeCode : null;

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Check if the employeeCode already exists
      const checkUserQuery = `
        SELECT COUNT(*) as count FROM Employees WHERE EmployeeCode = @employeeCode
      `;
      const checkUserResult = await transaction.request()
        .input('employeeCode', sql.VarChar, employeeCode)
        .query(checkUserQuery);

      if (checkUserResult.recordset[0].count > 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Employee code already exists' });
      }

      // Fetch RoleID
      const roleResult = await transaction.request()
        .input('loginType', sql.VarChar, loginType)
        .query(`
          SELECT roleName FROM Roles WHERE roleName = @loginType
        `);

      if (roleResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Invalid role name' });
      }

      const roleName = roleResult.recordset[0].roleName;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await transaction.request()
        .input('password', sql.VarChar, hashedPassword)
        .input('regionName', sql.VarChar, region)
        .input('employeeCode', sql.VarChar, employeeCode)
        .input('branchName', sql.VarChar, branch)
        .input('employeeName', sql.VarChar, employeeName)
        .input('roleName', sql.VarChar, roleName)
        .input('email', sql.VarChar, email)
        .input('mobileNo', sql.VarChar, mobileNo)
        .input('createdBy', sql.VarChar, createdByEmployeeCode) 
        .input('createdAt', sql.DateTime, new Date())
        .query(`
          INSERT INTO Employees (Password, RegionName, EmployeeCode, BranchName, EmployeeName, roleName, Email, MobileNo, CreatedBy, CreatedAt)
          VALUES (@password, @regionName, @employeeCode, @branchName, @employeeName, @roleName, @email, @mobileNo, @createdBy, @createdAt)
        `);

      await transaction.commit();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      await transaction.rollback();
      console.error('Transaction error: ', err.message);
      res.status(500).json({ message: 'Transaction error', error: err.message });
    }
  } catch (err) {
    console.error('Database connection error: ', err.message);
    res.status(500).json({ message: 'Database connection error', error: err.message });
  }
};
