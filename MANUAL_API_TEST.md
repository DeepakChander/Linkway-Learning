# Manual API Testing Guide

## Your Cratio CRM Credentials

**API Key:** `NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz`

**API Endpoint:** *[GET THIS FROM CRATIO SUPPORT]*

---

## Method 1: Test with Bearer Token (Most Common)

Replace `YOUR_ENDPOINT_URL` with the actual endpoint from Cratio:

### Windows (PowerShell)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz"
    "Accept" = "application/json"
}

$body = @{
    lead_name = "Test User"
    email = "test@example.com"
    phone = "+919876543210"
    interested_course = "Data Analytics"
    lead_source = "website"
} | ConvertTo-Json

Invoke-WebRequest -Uri "YOUR_ENDPOINT_URL" -Method POST -Headers $headers -Body $body
```

### Windows (CMD with curl)
```bash
curl -X POST "YOUR_ENDPOINT_URL" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz" ^
  -H "Accept: application/json" ^
  -d "{\"lead_name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+919876543210\",\"interested_course\":\"Data Analytics\",\"lead_source\":\"website\"}"
```

### Linux/Mac (Bash)
```bash
curl -X POST "YOUR_ENDPOINT_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz" \
  -H "Accept: application/json" \
  -d '{
    "lead_name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "interested_course": "Data Analytics",
    "lead_source": "website"
  }'
```

---

## Method 2: Test with X-API-Key Header

### Windows (PowerShell)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "X-API-Key" = "NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz"
    "Accept" = "application/json"
}

$body = @{
    lead_name = "Test User"
    email = "test@example.com"
    phone = "+919876543210"
    interested_course = "Data Analytics"
    lead_source = "website"
} | ConvertTo-Json

Invoke-WebRequest -Uri "YOUR_ENDPOINT_URL" -Method POST -Headers $headers -Body $body
```

### Bash/CMD curl
```bash
curl -X POST "YOUR_ENDPOINT_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz" \
  -H "Accept: application/json" \
  -d '{
    "lead_name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "interested_course": "Data Analytics",
    "lead_source": "website"
  }'
```

---

## Method 3: Test with API Key in URL

```bash
curl -X POST "YOUR_ENDPOINT_URL?api_key=NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "lead_name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "interested_course": "Data Analytics",
    "lead_source": "website"
  }'
```

---

## Understanding Responses

### ✅ Success (200/201)
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead_id": "12345"
}
```
**Action:** API is working! Update `.env.local` with the endpoint URL.

### ❌ Unauthorized (401)
```json
{
  "error": "Invalid API key"
}
```
**Action:** Check API key with Cratio support.

### ❌ Bad Request (400)
```json
{
  "error": "Missing required field: email"
}
```
**Action:** Update field names in the request based on Cratio's requirements.

### ❌ Not Found (404)
```json
{
  "error": "Endpoint not found"
}
```
**Action:** Verify the endpoint URL with Cratio support.

---

## After Getting the Endpoint URL

1. **Update `.env.local`:**
```env
NEXT_PUBLIC_CRATIO_API_URL=https://your-actual-endpoint.cratio.com/api/leads
CRATIO_API_KEY=NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz
```

2. **Update field mappings in `src/lib/api/cratio.ts` if needed**

3. **Test your website:**
```bash
npm run dev
```

4. **Open http://localhost:3000 and test the forms**

---

## Quick Reference

| What You Have | Status |
|---------------|--------|
| API Key | ✅ `NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz` |
| API Endpoint | ❌ **NEED THIS FROM CRATIO** |
| Razorpay Link | ✅ `https://rzp.io/rzp/linkwaylearning` |

---

## Razorpay Payment Link Test

Your Razorpay payment link is already set up and working:

**Test it:** Open https://rzp.io/rzp/linkwaylearning in your browser

✅ If it opens a payment page, you're all set!

---

## Need Help?

**Cratio CRM Support:**
- Email: support@cratio.com
- Phone: +91-74 1819 1100
- Portal: https://support.cratio.com/

**What to ask them:**
> "I need the API endpoint URL for lead submission. My API key is: NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz. Can you provide:
> 1. The full API endpoint URL
> 2. The authentication method (Bearer token, X-API-Key, etc.)
> 3. The required field names for lead submission
> 4. A sample CURL request"
