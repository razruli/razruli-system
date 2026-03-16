#!/bin/bash

# Test onboarding flow with CSV files using curl
# This script will submit CSV data and capture the response

API_URL="http://localhost:3000/api/onboarding/submit"
TEST_DATA_DIR="./test-data"
CSV_FILE="$TEST_DATA_DIR/test-employees-minimal.csv"

echo "🧪 Testing Onboarding Flow"
echo "============================================================"
echo ""

# Check if CSV file exists
if [ ! -f "$CSV_FILE" ]; then
  echo "❌ CSV file not found: $CSV_FILE"
  exit 1
fi

echo "✅ CSV file loaded: $(basename $CSV_FILE)"
echo ""
echo "📋 CSV Headers:"
head -1 "$CSV_FILE" | tr ',' '\n' | sed 's/^/   /'
echo ""
echo "📋 CSV Data (first 3 rows):"
head -4 "$CSV_FILE" | tail -3 | sed 's/^/   /'
echo ""

# Create column mapping JSON
# Russian headers → database field names
COLUMN_MAPPING='{
  "ФИО": "fio",
  "Дата найма": "hireDate",
  "Отдел": "department",
  "Грейд": "grade",
  "Тип занятости": "employmentType",
  "Статус": "status"
}'

# Company data
COMPANY_DATA='{
  "name": "Test Company 2026-03-15",
  "timezone": "UTC+3"
}'

# Role data
ROLE_DATA='{
  "name": "Director"
}'

echo "📤 Step 1: Submitting to API..."
echo "   URL: $API_URL"
echo ""

# Send the request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -F "company=$COMPANY_DATA" \
  -F "role=$ROLE_DATA" \
  -F "files=@$CSV_FILE" \
  -F "mapping_$(basename $CSV_FILE)=$COLUMN_MAPPING")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Response Status: $HTTP_CODE"
echo ""
echo "ResponseBody:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

echo "============================================================"
echo "📊 Test Results:"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ SUCCESS! Onboarding completed successfully!"
  echo "$BODY" | jq '.employees.created' | sed 's/^/   Created: /'
else
  echo "❌ FAILED! Errors encountered:"
  echo ""
  
  # Parse error details
  ERROR=$(echo "$BODY" | jq -r '.error' 2>/dev/null)
  if [ ! -z "$ERROR" ] && [ "$ERROR" != "null" ]; then
    echo "Error: $ERROR"
    echo ""
  fi

  # Show missing departments
  MISSING_DEPTS=$(echo "$BODY" | jq -r '.missingDepartments[]?' 2>/dev/null)
  if [ ! -z "$MISSING_DEPTS" ]; then
    echo "❌ Missing Departments:"
    echo "$MISSING_DEPTS" | sed 's/^/   - /'
    echo ""
    echo "FIX: Create these departments in the database first"
    echo ""
  fi

  # Show missing grades
  MISSING_GRADES=$(echo "$BODY" | jq -r '.missingGrades[]?' 2>/dev/null)
  if [ ! -z "$MISSING_GRADES" ]; then
    echo "❌ Missing Grades:"
    echo "$MISSING_GRADES" | sed 's/^/   - /'
    echo ""
    echo "FIX: Create these grades in the database first"
    echo ""
  fi

  # Show details
  DETAILS=$(echo "$BODY" | jq '.details' 2>/dev/null)
  if [ ! "$DETAILS" = "null" ] && [ ! -z "$DETAILS" ]; then
    echo "📋 File Processing Errors:"
    echo "$BODY" | jq '.details' | sed 's/^/   /'
    echo ""
  fi

  # Show message if present
  MESSAGE=$(echo "$BODY" | jq -r '.message' 2>/dev/null)
  if [ ! -z "$MESSAGE" ] && [ "$MESSAGE" != "null" ]; then
    echo "Details: $MESSAGE"
    echo ""
  fi
fi

echo "============================================================"
