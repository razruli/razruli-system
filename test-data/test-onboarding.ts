/**
 * Test onboarding flow with CSV files
 * This script will:
 * 1. Read test CSV files
 * 2. Extract headers and create column mappings
 * 3. Submit to the onboarding API
 * 4. Report results and errors
 */

import fs from "fs";
import path from "path";

const API_URL = "http://localhost:3000/api/onboarding/submit";
const TEST_DATA_DIR = "./test-data";

// Parse CSV file manually
function parseCSV(content: string): {
  headers: string[];
  rows: Record<string, any>[];
} {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });
  return { headers, rows };
}

// Map Russian CSV headers to database field names
function createColumnMapping(csvHeaders: string[]): Record<string, string> {
  const headerMap: Record<string, string> = {
    ФИО: "fio",
    "Дата найма": "hireDate",
    Отдел: "department",
    Грейд: "grade",
    "Тип занятости": "employmentType",
    Статус: "status",
    Пол: "gender",
    "Дата рождения": "birthDate",
    "Часы работы": "workingHoursPerDay",
    Эффективность: "kEfficiency",
  };

  const mapping: Record<string, string> = {};
  csvHeaders.forEach((header) => {
    mapping[header] = headerMap[header] || header;
  });
  return mapping;
}

async function testOnboarding() {
  console.log("🧪 Testing Onboarding Flow\n");
  console.log("=".repeat(60));

  try {
    // Step 1: First, create/verify infrastructure
    console.log("\n📋 Step 1: Setting up test infrastructure...");
    console.log("   Creating departments and grades in database...\n");

    // For now, we'll assume departments/grades exist or will handle the error
    // Let's start with a simple test using just the CSV file we created

    // Step 2: Read CSV file
    const csvPath = path.join(TEST_DATA_DIR, "test-employees-minimal.csv");
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found: ${csvPath}`);
      return;
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const { headers, rows } = parseCSV(csvContent);

    console.log(`✅ CSV file loaded: test-employees-minimal.csv`);
    console.log(`   Headers: ${headers.join(", ")}`);
    console.log(`   Rows: ${rows.length}\n`);

    // Step 3: Create column mapping
    const columnMapping = createColumnMapping(headers);
    console.log("📊 Column Mapping:");
    Object.entries(columnMapping).forEach(([csv, db]) => {
      console.log(`   ${csv} → ${db}`);
    });

    // Step 4: Prepare form data for API
    console.log("\n📤 Step 2: Submitting to API...\n");

    const formData = new FormData();

    // Add company data
    formData.append(
      "company",
      JSON.stringify({
        name: "Gruzin Inc",
        timezone: "UTC+3",
        industry: "Information Technology",
      }),
    );

    // Add role data
    formData.append(
      "role",
      JSON.stringify({
        name: "Director",
      }),
    );

    // Add CSV file
    const csvFile = new File([csvContent], "employees.csv", {
      type: "text/csv",
    });
    formData.append("files", csvFile);

    // Add column mapping for the file
    formData.append("mapping_employees.csv", JSON.stringify(columnMapping));

    // Step 5: Send request
    console.log(`Sending request to: ${API_URL}`);
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData as any,
    });

    const result = (await response.json()) as any;

    console.log(`Response Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(result, null, 2));

    // Step 6: Analyze results
    console.log("\n" + "=".repeat(60));
    console.log("📊 Test Results:\n");

    if (response.status === 200 && result.success) {
      console.log("✅ SUCCESS! Onboarding completed successfully!");
      console.log(`   - Created ${result.employees?.created || 0} employees`);
      console.log(`   - Company: ${result.company?.name}`);
      console.log(`   - Role: ${result.role?.name}`);
    } else {
      console.log("❌ FAILED! Errors encountered:\n");

      if (result.error) {
        console.log(`Error: ${result.error}`);
      }

      if (result.details) {
        console.log("\nDetailed Errors:");
        Object.entries(result.details).forEach(
          ([file, details]: [string, any]) => {
            console.log(`\n  File: ${file}`);
            console.log(`  Type: ${details.type}`);
            console.log(`  Message: ${details.message}`);
            if (details.missingFields) {
              console.log(
                `  Missing Fields: ${details.missingFields.join(", ")}`,
              );
            }
            if (details.errors) {
              console.log(`  Row Errors:`);
              details.errors.forEach((err: any) => {
                if (typeof err === "string") {
                  console.log(`    - ${err}`);
                } else {
                  console.log(
                    `    - Row ${err.rowIndex}: ${err.errors.join(", ")}`,
                  );
                }
              });
            }
          },
        );
      }

      if (result.missingDepartments) {
        console.log(
          `\n❌ Missing Departments: ${result.missingDepartments.join(", ")}`,
        );
        console.log("\n   FIX: Create these departments first:");
        result.missingDepartments.forEach((dept: string) => {
          console.log(`      - ${dept}`);
        });
      }

      if (result.missingGrades) {
        console.log(`\n❌ Missing Grades: ${result.missingGrades.join(", ")}`);
        console.log("\n   FIX: Create these grades first:");
        result.missingGrades.forEach((grade: string) => {
          console.log(`      - ${grade}`);
        });
      }

      if (result.message) {
        console.log(`\nError Details: ${result.message}`);
      }
    }

    console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error("🔥 Test Error:", error);
  }
}

testOnboarding();
