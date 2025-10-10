const XLSX = require('xlsx');
const path = require('path');

// Analyze the Excel file structure
function analyzeExcelFile() {
  try {
    const filePath = path.join(__dirname, '../public/products.xlsx');
    console.log('Reading Excel file:', filePath);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    console.log('Sheet name:', sheetName);
    
    // Convert to JSON to see the structure
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      console.log('No data found in the Excel file');
      return;
    }
    
    // Get headers (first row)
    const headers = jsonData[0];
    console.log('\n=== EXCEL FILE STRUCTURE ===');
    console.log('Total rows:', jsonData.length);
    console.log('Total columns:', headers.length);
    console.log('\nColumn headers:');
    headers.forEach((header, index) => {
      console.log(`${index + 1}. ${header}`);
    });
    
    // Show first few rows of data
    console.log('\n=== SAMPLE DATA (First 3 rows) ===');
    for (let i = 0; i < Math.min(3, jsonData.length); i++) {
      console.log(`\nRow ${i + 1}:`);
      headers.forEach((header, index) => {
        const value = jsonData[i][index];
        console.log(`  ${header}: ${value}`);
      });
    }
    
    // Analyze data types
    console.log('\n=== DATA TYPE ANALYSIS ===');
    headers.forEach((header, index) => {
      const values = jsonData.slice(1).map(row => row[index]).filter(val => val !== undefined && val !== '');
      const types = [...new Set(values.map(val => typeof val))];
      console.log(`${header}: ${types.join(', ')} (${values.length} non-empty values)`);
    });
    
  } catch (error) {
    console.error('Error analyzing Excel file:', error);
  }
}

analyzeExcelFile();
