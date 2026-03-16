#!/bin/bash

API_URL="http://localhost:3000/api/onboarding/submit"
CSV_FILE="./test-data/test-employees-full.csv"

COLUMN_MAPPING='{
  "ФИО": "fio",
  "Дата найма": "hireDate",
  "Отдел": "department",
  "Грейд": "grade",
  "Тип занятости": "employmentType",
  "Статус": "status",
  "Пол": "gender",
  "Дата рождения": "birthDate",
  "Часы работы": "workingHoursPerDay",
  "Эффективность": "kEfficiency"
}'

COMPANY_DATA='{
  "name": "Test Company 2026-03-15",
  "timezone": "UTC+3"
}'

ROLE_DATA='{"name": "Director"}'

echo "Testing Full CSV with Optional Fields..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -F "company=$COMPANY_DATA" \
  -F "role=$ROLE_DATA" \
  -F "files=@$CSV_FILE" \
  -F "mapping_$(basename $CSV_FILE)=$COLUMN_MAPPING")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Status: $HTTP_CODE"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
