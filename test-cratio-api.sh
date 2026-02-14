#!/bin/bash

# Cratio CRM API Test Script
# API Docs: https://api.cratiocrm.com/
# All endpoints confirmed working on 2026-02-14

API_KEY="NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz"
BASE_URL="http://apps.cratiocrm.com/api/apirequest.php"
TODAY=$(date +%Y-%m-%d)

echo "========================================"
echo "Cratio CRM API - Live Test"
echo "Base URL: $BASE_URL"
echo "Date: $TODAY"
echo "========================================"

# ---- TEST 1: Create Lead (insertRecords) ----
echo ""
echo "========================================"
echo "TEST 1: Create Lead (insertRecords)"
echo "========================================"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "${BASE_URL}?operation=insertRecords&apikey=${API_KEY}&formname=Leads&overwrite=false" \
  -H "Content-Type: application/json" \
  -d "{\"records\":[{\"Contact Name\":\"Test API User\",\"Email\":\"test-api@linkwaylearning.com\",\"Mobile Number\":\"9999900001\",\"Lead Date\":\"${TODAY}\"}]}" 2>&1)

http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
body=$(echo "$response" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $http_code"
echo "Response: $body"

# Extract Form ID from response for later tests
FORM_ID=$(echo "$body" | grep -oP '"formid":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Extracted Form ID: $FORM_ID"

# ---- TEST 2: Get All Leads (getAllRecords) ----
echo ""
echo "========================================"
echo "TEST 2: Get All Leads (getAllRecords)"
echo "========================================"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "${BASE_URL}?operation=getAllRecords&apikey=${API_KEY}&formname=Leads" \
  -H "Content-Type: application/json" \
  -d '{"displayfields":["Contact Name","Mobile Number","Email","Lead Date","Lead Stage"],"pageno":1,"numofrecords":5,"sortcolumn":"Lead Date","sortorder":"desc","isnull":1}' 2>&1)

http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
body=$(echo "$response" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $http_code"
echo "Response: $body"

# ---- TEST 3: Search Leads (getRecordsBySearch) ----
echo ""
echo "========================================"
echo "TEST 3: Search Leads (getRecordsBySearch)"
echo "========================================"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "${BASE_URL}?operation=getRecordsBySearch&apikey=${API_KEY}&formname=Leads" \
  -H "Content-Type: application/json" \
  -d '{"displayfields":["Contact Name","Mobile Number","Email","Lead Date","Lead Stage"],"pageno":1,"numofrecords":5,"isnull":1,"searchcondition":"Contact Name@contains@Test API@AND$"}' 2>&1)

http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
body=$(echo "$response" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $http_code"
echo "Response: $body"

# ---- TEST 4: Update Lead (updateRecords) ----
echo ""
echo "========================================"
echo "TEST 4: Update Lead (updateRecords)"
echo "========================================"

if [ -n "$FORM_ID" ]; then
  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
    "${BASE_URL}?operation=updateRecords&apikey=${API_KEY}&formname=Leads" \
    -H "Content-Type: application/json" \
    -d "{\"records\":[{\"Form ID\":\"${FORM_ID}\",\"Contact Name\":\"Test API User Updated\",\"Lead Stage\":\"interested\"}]}" 2>&1)

  http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
  body=$(echo "$response" | sed '/HTTP_CODE:/d')

  echo "HTTP Status: $http_code"
  echo "Response: $body"
else
  echo "SKIPPED: No Form ID from insert test"
fi

# ---- Summary ----
echo ""
echo "========================================"
echo "Test Complete"
echo "========================================"
echo ""
echo "Expected results:"
echo "  TEST 1: {\"success\":[{\"rowindex\":1,\"formid\":\"...\",\"info\":\"created\"}]}"
echo "  TEST 2: {\"pageno\":1,\"totalrows\":N,\"responserows\":5,\"data\":[...]}"
echo "  TEST 3: {\"pageno\":1,\"totalrows\":N,\"data\":[...matching leads...]}"
echo "  TEST 4: {\"success\":[{\"rowindex\":1,\"info\":\"updated\"}]}"
echo ""
echo "Error codes from API docs:"
echo "  401: API Key is missing"
echo "  402: No valid API Key provided"
echo "  403: Reached max API limit (250/day)"
echo "  405: Module name missing"
echo "  406: Invalid operation name"
echo "  407: Invalid module name"
