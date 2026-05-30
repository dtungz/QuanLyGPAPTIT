const xlsx = require('xlsx');
const path = 'C:\\Users\\Admin\\Downloads\\DiemThi\\DiemThi.xlsx';

try {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(JSON.stringify(data.slice(15, 30), null, 2)); 
} catch (e) {
  console.error("Error reading excel file:", e.message);
}
