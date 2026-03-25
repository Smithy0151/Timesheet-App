import { Pool } from "pg";
import type { ProjectRecord } from "@/app/types/project";
import * as XLSX from "xlsx";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: Request) {
  const client = await pool.connect();

  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    console.log("Querying database - department:", department, "year:", year, "month:", month);

    // Build query with filters
    let query = "SELECT * FROM timesheets WHERE 1=1";
    const params: (string | number)[] = [];
    let paramCount = 1;

    if (department) {
      query += ` AND department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    if (year) {
      query += ` AND year = $${paramCount}`;
      params.push(year);
      paramCount++;
    }

    if (month) {
      query += ` AND month = $${paramCount}`;
      params.push(month);
      paramCount++;
    }

    query += " ORDER BY timesheet_wc DESC";

    // Execute query
    const result = await client.query(query, params.length > 0 ? params : undefined);

    console.log("Query returned:", result.rows.length, "rows");

    // Transform database schema to match ProjectRecord format
    const transformedData: ProjectRecord[] = result.rows.map((row: any) => ({
      Client: row.client,
      Department: row.department,
      "Timesheet of User": row.timesheet_user,
      "Timesheet W/C": row.timesheet_wc,
      Month: row.month,
      Year: row.year,
      "Project Manager": row.project_manager,
      "Project Reference": row.project_reference,
      "Project Title": row.project_title,
      "Category of Time": row.category_of_time,
      "Non-Project Timesheet sub category": row.non_project_timesheet_sub_category,
      Chargeable: row.chargeable ? "Yes" : "No",
      Overhead: row.overhead ? "Yes" : "No",
      "Budget Category": row.budget_category,
      "Support ticket reference": row.support_ticket_reference,
      "Sprint Item name": row.sprint_item_name,
      "Ad-hoc notes": row.ad_hoc_notes,
      "Time Spent in Hours": row.time_spent_hours,
      "Time spent in days": row.time_spent_days,
    }));

    console.log("Transformed data sample:", transformedData.slice(0, 1));

    return Response.json(transformedData);
  } catch (error) {
    console.error("Database query error:", error);
    return Response.json(
      {
        error: "Failed to fetch data from database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return Response.json(
        { error: "File must be an Excel file (.xlsx or .xls)" },
        { status: 400 }
      );
    }

    // Read file into memory
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Processing ${data.length} rows...`);

    // Transform data
    const transformedData = data.map((row: any) => ({
      client: row.Client || null,
      department: row.Department || null,
      timesheet_user: row["Timesheet of User"] || null,
      timesheet_wc: row["Timesheet W/C"] || null,
      month: row.Month || null,
      year: row.Year || null,
      project_manager: row["Project Manager"] || null,
      project_reference: row["Project reference"] || null,
      project_title: row["Project Title"] || null,
      category_of_time: row["Category of Time"] || null,
      non_project_timesheet_sub_category:
        row["Non-Project Timesheet sub category"] || null,
      chargeable: row.Chargeable === "Yes",
      overhead: row.Overhead === "Yes",
      budget_category: row["Budget Category"] || null,
      support_ticket_reference: row["Support ticket reference"] || null,
      sprint_item_name: row["Sprint Item name"] || null,
      ad_hoc_notes: row["Ad-hoc notes"] || null,
      time_spent_hours: parseFloat(row["Time Spent in Hours"]) || 0,
      time_spent_days: parseFloat(row["Time spent in days"]) || 0,
    }));

    // Optional: clear existing data
    await client.query("TRUNCATE TABLE timesheets;");
    console.log("✓ Cleared existing data");

    // Insert in batches
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);

      const placeholders = batch
        .map((_, idx) => {
          const offset = idx * 19;
          return `(${Array.from({ length: 19 }, (_, j) => `$${offset + j + 1}`).join(",")})`;
        })
        .join(",");

      const values = batch.flatMap((row) => [
        row.client,
        row.department,
        row.timesheet_user,
        row.timesheet_wc,
        row.month,
        row.year,
        row.project_manager,
        row.project_reference,
        row.project_title,
        row.category_of_time,
        row.non_project_timesheet_sub_category,
        row.chargeable,
        row.overhead,
        row.budget_category,
        row.support_ticket_reference,
        row.sprint_item_name,
        row.ad_hoc_notes,
        row.time_spent_hours,
        row.time_spent_days,
      ]);

      const insertSQL = `
        INSERT INTO timesheets (
          client, department, timesheet_user, timesheet_wc, month, year,
          project_manager, project_reference, project_title, category_of_time,
          non_project_timesheet_sub_category, chargeable, overhead, budget_category,
          support_ticket_reference, sprint_item_name, ad_hoc_notes,
          time_spent_hours, time_spent_days
        ) VALUES ${placeholders}
      `;

      await client.query(insertSQL, values);
      insertedCount += batch.length;

      console.log(`✓ Inserted ${insertedCount}/${transformedData.length}`);
    }

    return Response.json({
      success: true,
      message: `Uploaded ${transformedData.length} rows`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}