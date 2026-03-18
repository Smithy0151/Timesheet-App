import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  // Read pre-built JSON from public directory instead of reading Excel at runtime
  const filePath = path.join(process.cwd(), "public", "livedata.json");
  
  if (!fs.existsSync(filePath)) {
    console.error("Data file not found at", filePath);
    return Response.json(
      { error: "Data not available. Please rebuild the application." },
      { status: 500 }
    );
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContent);

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return Response.json(
        { error: "File must be an Excel file (.xlsx or .xls)" },
        { status: 400 }
      );
    }

    // Read the file buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save the file
    const filePath = path.join(dataDir, "LiveData.xlsx");
    fs.writeFileSync(filePath, uint8Array);

    return Response.json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}