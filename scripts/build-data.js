/**
 * Build-time script to convert Excel data to JSON
 * This runs before Next.js builds, when file system is writable
 */
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const publicDir = path.join(__dirname, "..", "public");
const excelFile = path.join(dataDir, "LiveData.xlsx");
const outputFile = path.join(publicDir, "livedata.json");

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  console.log("Reading Excel file:", excelFile);
  const buffer = fs.readFileSync(excelFile);
  const workbook = XLSX.read(buffer);
  
  console.log("Available sheets:", workbook.SheetNames);
  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log("Converted", data.length, "rows to JSON");
  
  // Write to public directory
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log("✓ Data written to:", outputFile);
} catch (error) {
  console.error("✗ Failed to build data:", error.message);
  process.exit(1);
}
