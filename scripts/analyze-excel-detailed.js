const XLSX = require('xlsx');
const path = require('path');

// Analyze the Excel file structure in detail
function analyzeExcelFileDetailed() {
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
    
    console.log('\n=== DETAILED COLUMN ANALYSIS ===');
    console.log('Total rows:', jsonData.length);
    
    // Find the actual header row (skip group headers)
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row[0] && typeof row[0] === 'string' && row[0].includes('TIMCO Item Code')) {
        headerRowIndex = i;
        break;
      }
    }
    
    console.log('Header row index:', headerRowIndex);
    
    // Get actual headers
    const headers = jsonData[headerRowIndex];
    console.log('\n=== ACTUAL FIELD HEADERS ===');
    headers.forEach((header, index) => {
      if (header && header.trim()) {
        console.log(`${index + 1}. "${header}"`);
      }
    });
    
    // Show sample data from the data rows
    console.log('\n=== SAMPLE DATA ROWS ===');
    const dataStartRow = headerRowIndex + 1;
    for (let i = dataStartRow; i < Math.min(dataStartRow + 3, jsonData.length); i++) {
      console.log(`\n--- Row ${i + 1} ---`);
      headers.forEach((header, index) => {
        const value = jsonData[i][index];
        if (header && header.trim() && value !== undefined && value !== '') {
          console.log(`${header}: "${value}"`);
        }
      });
    }
    
    // Count non-empty values per column
    console.log('\n=== COLUMN STATISTICS ===');
    headers.forEach((header, index) => {
      if (header && header.trim()) {
        const values = jsonData.slice(dataStartRow).map(row => row[index]).filter(val => val !== undefined && val !== '');
        console.log(`${header}: ${values.length} non-empty values`);
      }
    });
    
  } catch (error) {
    console.error('Error analyzing Excel file:', error);
  }
}

analyzeExcelFileDetailed();
