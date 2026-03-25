const XLSX = require("xlsx");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment variables");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function createTable(client) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS timesheets (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      client TEXT,
      department TEXT,
      timesheet_user TEXT,
      timesheet_wc INTEGER,
      month TEXT,
      year TEXT,
      project_manager TEXT,
      project_reference TEXT,
      project_title TEXT,
      category_of_time TEXT,
      non_project_timesheet_sub_category TEXT,
      chargeable BOOLEAN,
      overhead BOOLEAN,
      budget_category TEXT,
      support_ticket_reference TEXT,
      sprint_item_name TEXT,
      ad_hoc_notes TEXT,
      time_spent_hours NUMERIC,
      time_spent_days NUMERIC
    );
  `;

  await client.query(createTableSQL);
  console.log("✓ Table 'timesheets' ready");
}

async function uploadExcelToNeon() {
  const client = await pool.connect();

  try {
    // Create table if it doesn't exist
    await createTable(client);

    // Clear existing data
    await client.query('TRUNCATE TABLE timesheets;');
    console.log('✓ Cleared existing data');

    // Read Excel file
    const excelFile = path.join(__dirname, "..", "data", "LiveData.xlsx");
    const buffer = require("fs").readFileSync(excelFile);
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Processing ${data.length} rows from Excel...`);

    // Transform data
    const transformedData = data.map((row) => ({
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
      non_project_timesheet_sub_category: row["Non-Project Timesheet sub category"] || null,
      chargeable: row.Chargeable === "Yes",
      overhead: row.Overhead === "Yes",
      budget_category: row["Budget Category"] || null,
      support_ticket_reference: row["Support ticket reference"] || null,
      sprint_item_name: row["Sprint Item name"] || null,
      ad_hoc_notes: row["Ad-hoc notes"] || null,
      time_spent_hours: parseFloat(row["Time Spent in Hours"]) || 0,
      time_spent_days: parseFloat(row["Time spent in days"]) || 0,
    }));

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
      console.log(`✓ Inserted ${insertedCount}/${transformedData.length} rows`);
    }

    console.log(`\n✓ Successfully uploaded all ${transformedData.length} rows to Neon!`);
  } catch (error) {
    console.error("✗ Upload failed:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

uploadExcelToNeon();
