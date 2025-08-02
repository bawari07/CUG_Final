import xlsx from 'xlsx';
import { poolPromise, sql } from '../Database/db.js';

export const saveExcelDataToDB = async (filePath, insertedByEmployeeCode) => {
  try {

    const workbook = xlsx.readFile(filePath, { raw: true });
    const sheetName = workbook.SheetNames[0];  
    const worksheet = workbook.Sheets[sheetName];


    const excelData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    const pool = await poolPromise;

    for (let row of excelData) {
      try {
       
        const iccidNumber = String(row['iccidNumber'] || '').trim();
        const imsiNumber = String(row['imsiNumber'] || '').trim();
        const telecomPartner = String(row['telecomPartner'] || '').trim();
        const telecomCircle = String(row['telecomCircle'] || '').trim();

        await pool.request()
          .input('iccidNumber', sql.VarChar, iccidNumber)  
          .input('imsiNumber', sql.VarChar, imsiNumber)
          .input('telecomPartner', sql.VarChar, telecomPartner)
          .input('telecomCircle', sql.VarChar, telecomCircle)
          .input('insertedBy', sql.VarChar, insertedByEmployeeCode)  
          .query('INSERT INTO SimCardsMaster (iccidNumber, imsiNumber, telecomPartner, telecomCircle, insertedBy) VALUES (@iccidNumber, @imsiNumber, @telecomPartner, @telecomCircle, @insertedBy)');
      } catch (error) {
        console.error('Error inserting row into DB:', error.message);
        throw error;
      }
    }

    console.log('Data successfully saved to the database.');
  } catch (error) {
    console.error('Error processing Excel file:', error.message);
    throw error;
  }
};
