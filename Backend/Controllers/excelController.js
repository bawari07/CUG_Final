import path from 'path';
import {saveExcelDataToDB} from '../Services/excelService.js'; 
export const uploadExcel = async (req, res) => {

  if (!req.files || !req.files.excelFile) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.excelFile;
  const uploadDir = path.resolve('uploads');  
  const fileExtension = path.extname(file.name);  
  const currentDate = new Date().toISOString().replace(/:/g, '-'); 

  const newFileName = `${path.basename(file.name, fileExtension)}_${currentDate}${fileExtension}`;
  const uploadPath = path.join(uploadDir, newFileName);  

 
  const insertedByEmployeeCode = req.user ? req.user.employeeCode : null;

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send('Failed to upload file.');
    }

    try {

      await saveExcelDataToDB(uploadPath, insertedByEmployeeCode);

      res.status(200).send('File uploaded and data saved to database.');
    } catch (error) {
      res.status(500).send('Error processing the Excel file.');
    }
  });
};