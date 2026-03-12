import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const filePath = path.join(process.cwd(), "data", "LiveData.xlsx");

  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer);

  console.log("Available sheets:", workbook.SheetNames);

  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const data = XLSX.utils.sheet_to_json(sheet);

  console.log("Total rows:", data.length);
  console.log("Filtering with - department:", department, "year:", year);

  // Filter the data based on department and year
  let filteredData = data;

  if (department) {
    filteredData = filteredData.filter(
      (row: any) => row.Department === department
    );
    console.log("After department filter:", filteredData.length);
  }

  if (year) {
    filteredData = filteredData.filter(
      (row: any) => row.Year === year
    );
    console.log("After year filter:", filteredData.length);
  }

  if (month) {
    filteredData = filteredData.filter(
      (row: any) => row.Month === month
    );
    console.log("After month filter:", filteredData.length);
  }

  console.log("Filtered data sample:", filteredData.slice(0, 2));

  return Response.json(filteredData);
}