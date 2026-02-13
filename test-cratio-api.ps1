# Cratio CRM API Test Script (PowerShell for Windows)
# This script tests different possible API endpoint patterns

$API_KEY = "NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz"

Write-Host "========================================"
Write-Host "Testing Cratio CRM API Endpoints"
Write-Host "========================================"
Write-Host ""

# Test data
$TEST_DATA = @{
    lead_name = "Test User"
    email = "test@example.com"
    phone = "+919876543210"
    interested_course = "Data Analytics"
    lead_source = "website"
} | ConvertTo-Json

Write-Host "Test Lead Data:"
Write-Host $TEST_DATA
Write-Host ""

# Common CRM API endpoint patterns
$ENDPOINTS = @(
    "https://api.cratio.com/v1/leads",
    "https://api.cratio.com/api/leads",
    "https://app.cratio.com/api/v1/leads",
    "https://app.cratio.com/api/leads",
    "https://cratiocrm.com/api/v1/leads",
    "https://cratiocrm.com/api/leads"
)

Write-Host "========================================"
Write-Host "Testing with Bearer Token Authentication"
Write-Host "========================================"

foreach ($endpoint in $ENDPOINTS) {
    Write-Host ""
    Write-Host "Testing: $endpoint"
    Write-Host "----------------------------------------"

    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $API_KEY"
            "Accept" = "application/json"
        }

        $response = Invoke-WebRequest -Uri $endpoint -Method POST -Headers $headers -Body $TEST_DATA -ErrorAction Stop
        Write-Host "HTTP Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    }
    catch {
        Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Testing with X-API-Key Header"
Write-Host "========================================"

foreach ($endpoint in $ENDPOINTS) {
    Write-Host ""
    Write-Host "Testing: $endpoint"
    Write-Host "----------------------------------------"

    try {
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $API_KEY
            "Accept" = "application/json"
        }

        $response = Invoke-WebRequest -Uri $endpoint -Method POST -Headers $headers -Body $TEST_DATA -ErrorAction Stop
        Write-Host "HTTP Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    }
    catch {
        Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Testing with API Key in URL"
Write-Host "========================================"

foreach ($endpoint in $ENDPOINTS) {
    Write-Host ""
    Write-Host "Testing: ${endpoint}?api_key=***"
    Write-Host "----------------------------------------"

    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }

        $url = "${endpoint}?api_key=${API_KEY}"
        $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $TEST_DATA -ErrorAction Stop
        Write-Host "HTTP Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    }
    catch {
        Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Test Complete"
Write-Host "========================================"
Write-Host ""
Write-Host "Look for HTTP status codes:"
Write-Host "  - 200/201: Success"
Write-Host "  - 400: Bad Request (wrong field names or data format)"
Write-Host "  - 401: Unauthorized (wrong API key or auth method)"
Write-Host "  - 403: Forbidden (no access)"
Write-Host "  - 404: Not Found (wrong endpoint URL)"
Write-Host "  - 500: Server Error"
