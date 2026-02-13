#!/bin/bash

# Cratio CRM API Test Script
# This script tests different possible API endpoint patterns

API_KEY="NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz"

echo "========================================"
echo "Testing Cratio CRM API Endpoints"
echo "========================================"
echo ""

# Test data
TEST_DATA='{
  "lead_name": "Test User",
  "email": "test@example.com",
  "phone": "+919876543210",
  "interested_course": "Data Analytics",
  "lead_source": "website"
}'

echo "Test Lead Data:"
echo "$TEST_DATA"
echo ""

# Common CRM API endpoint patterns
ENDPOINTS=(
  "https://api.cratio.com/v1/leads"
  "https://api.cratio.com/api/leads"
  "https://app.cratio.com/api/v1/leads"
  "https://app.cratio.com/api/leads"
  "https://cratiocrm.com/api/v1/leads"
  "https://cratiocrm.com/api/leads"
)

echo "========================================"
echo "Testing with Bearer Token Authentication"
echo "========================================"

for endpoint in "${ENDPOINTS[@]}"; do
  echo ""
  echo "Testing: $endpoint"
  echo "----------------------------------------"

  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$endpoint" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json" \
    -d "$TEST_DATA" 2>&1)

  http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
  body=$(echo "$response" | sed '/HTTP_CODE:/d')

  echo "HTTP Status: $http_code"
  echo "Response: $body"
done

echo ""
echo "========================================"
echo "Testing with X-API-Key Header"
echo "========================================"

for endpoint in "${ENDPOINTS[@]}"; do
  echo ""
  echo "Testing: $endpoint"
  echo "----------------------------------------"

  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$endpoint" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: $API_KEY" \
    -H "Accept: application/json" \
    -d "$TEST_DATA" 2>&1)

  http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
  body=$(echo "$response" | sed '/HTTP_CODE:/d')

  echo "HTTP Status: $http_code"
  echo "Response: $body"
done

echo ""
echo "========================================"
echo "Testing with API Key in URL"
echo "========================================"

for endpoint in "${ENDPOINTS[@]}"; do
  echo ""
  echo "Testing: ${endpoint}?api_key=***"
  echo "----------------------------------------"

  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${endpoint}?api_key=${API_KEY}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$TEST_DATA" 2>&1)

  http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
  body=$(echo "$response" | sed '/HTTP_CODE:/d')

  echo "HTTP Status: $http_code"
  echo "Response: $body"
done

echo ""
echo "========================================"
echo "Testing with Auth Token Header"
echo "========================================"

for endpoint in "${ENDPOINTS[@]}"; do
  echo ""
  echo "Testing: $endpoint"
  echo "----------------------------------------"

  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$endpoint" \
    -H "Content-Type: application/json" \
    -H "Auth-Token: $API_KEY" \
    -H "Accept: application/json" \
    -d "$TEST_DATA" 2>&1)

  http_code=$(echo "$response" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
  body=$(echo "$response" | sed '/HTTP_CODE:/d')

  echo "HTTP Status: $http_code"
  echo "Response: $body"
done

echo ""
echo "========================================"
echo "Test Complete"
echo "========================================"
echo ""
echo "Look for HTTP status codes:"
echo "  - 200/201: Success"
echo "  - 400: Bad Request (wrong field names or data format)"
echo "  - 401: Unauthorized (wrong API key or auth method)"
echo "  - 403: Forbidden (no access)"
echo "  - 404: Not Found (wrong endpoint URL)"
echo "  - 500: Server Error"
