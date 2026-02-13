# 🚀 Quick Start Guide - API Integrations

## ✅ What's Been Implemented

### 1. **Lead Capture System** (Cratio CRM + Formspree)
- **When:** User fills enquiry form (Download Syllabus, Contact Us, etc.)
- **What:** Submits lead to Cratio CRM API + Formspree as backup
- **Files:**
  - `src/components/forms/EnquiryModal.tsx` - The enquiry form
  - `src/lib/api/cratio.ts` - Cratio CRM integration
  - `src/app/api/leads/submit/route.ts` - API endpoint

### 2. **Payment System** (Razorpay)
- **When:** User clicks "Enroll Now" on any course
- **What:** Collects details, saves lead, redirects to Razorpay payment
- **Link:** https://rzp.io/rzp/linkwaylearning (same for all courses)
- **Files:**
  - `src/components/forms/PurchaseModal.tsx` - Purchase form
  - `src/lib/api/razorpay.ts` - Razorpay integration
  - `src/components/sections/CoursePageTemplate.tsx` - Integrated in courses

---

## 📋 Setup Steps

### Step 1: Copy Environment File
```bash
cp .env.example .env.local
```

### Step 2: Get Cratio CRM Credentials

**Contact Cratio Support:**
- 📧 Email: support@cratio.com
- 🌐 Portal: support.cratio.com

**Ask for:**
1. API endpoint URL
2. API key/token
3. Field mapping documentation

### Step 3: Add Credentials to .env.local

```env
# Cratio CRM
NEXT_PUBLIC_CRATIO_API_URL=https://api.cratio.com/v1/leads
CRATIO_API_KEY=your_actual_api_key

# Website URL
NEXT_PUBLIC_BASE_URL=https://linkwaylearning.com
```

### Step 4: Test Cratio API with CURL

```bash
curl -X POST https://api.cratio.com/v1/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "lead_name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "interested_course": "Data Analytics",
    "lead_source": "website"
  }'
```

### Step 5: Update Field Names (if needed)

Based on the CURL response, update field names in `src/lib/api/cratio.ts`:

```typescript
const cratioPayload = {
  lead_name: leadData.fullName,  // Update this
  email: leadData.email,         // Update this
  phone: leadData.phone,         // Update this
  // ... etc
};
```

### Step 6: Test Locally

```bash
npm run dev
```

1. Open http://localhost:3000
2. Click "Download Syllabus" → Test enquiry form
3. Click "Enroll Now" → Test purchase flow
4. Check Cratio CRM dashboard for leads

### Step 7: Deploy

```bash
# Add env vars to Vercel/Netlify
vercel env add NEXT_PUBLIC_CRATIO_API_URL
vercel env add CRATIO_API_KEY
vercel env add NEXT_PUBLIC_BASE_URL

# Deploy
vercel --prod
```

---

## 🔍 How It Works

### Enquiry Flow
```
User fills form
    ↓
Submit to /api/leads/submit
    ↓
┌─────────────────┬─────────────────┐
│   Cratio CRM    │    Formspree    │
│   (Primary)     │    (Backup)     │
└─────────────────┴─────────────────┘
    ↓
Show success message
```

### Purchase Flow
```
User clicks "Enroll Now"
    ↓
Fill details (name, email, phone)
    ↓
Save lead to Cratio CRM
    ↓
Redirect to Razorpay
    ↓
User completes payment
```

---

## 🧪 Testing

### Test Enquiry Form
1. Go to any page
2. Click "Download Syllabus" or "Get in Touch"
3. Fill and submit form
4. **Expected:** Lead appears in Cratio CRM

### Test Purchase Flow
1. Go to course page (e.g., `/courses/data-analytics`)
2. Click "Enroll Now"
3. Fill details and click "Proceed to Payment"
4. **Expected:** Redirects to Razorpay payment page

### Test API Endpoint Directly
```bash
curl -X POST http://localhost:3000/api/leads/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "course": "Data Analytics",
    "background": "Student",
    "source": "website_enquiry"
  }'
```

---

## 🐛 Common Issues

### 1. "CRM API not configured" Error
- ✅ Add `NEXT_PUBLIC_CRATIO_API_URL` to `.env.local`
- ✅ Add `CRATIO_API_KEY` to `.env.local`
- ✅ Restart dev server: `npm run dev`

### 2. "401 Unauthorized" Error
- ✅ Check API key is correct
- ✅ Check authentication method in `src/lib/api/cratio.ts`
- ✅ Contact Cratio support to verify access

### 3. "400 Bad Request" Error
- ✅ Check field names match Cratio's requirements
- ✅ Test with CURL to see exact error
- ✅ Update field mappings in `src/lib/api/cratio.ts`

### 4. Payment Link Not Opening
- ✅ Check popup blocker
- ✅ Test link directly: https://rzp.io/rzp/linkwaylearning
- ✅ Check browser console for errors

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/lib/api/cratio.ts` | Cratio CRM integration logic |
| `src/lib/api/razorpay.ts` | Razorpay payment logic |
| `src/components/forms/EnquiryModal.tsx` | Lead capture form |
| `src/components/forms/PurchaseModal.tsx` | Purchase/enrollment form |
| `src/app/api/leads/submit/route.ts` | API endpoint for lead submission |
| `.env.local` | Environment variables (create from .env.example) |

---

## 🎯 Key Features

✅ **Dual Modal System**
- Enquiry Modal for lead capture
- Purchase Modal for course enrollment

✅ **Automatic Fallback**
- If Cratio CRM fails, Formspree catches the lead
- Never lose a lead!

✅ **Single Payment Link**
- Same Razorpay link for all courses
- Easy to manage

✅ **Lead Tracking**
- Captures source, course interest, background
- UTM parameters for marketing attribution

✅ **Production Ready**
- Error handling
- Loading states
- Validation
- Responsive design

---

## 📞 Support Contacts

- **Cratio CRM:** support@cratio.com
- **Razorpay:** https://razorpay.com/support/

---

## 🎉 You're All Set!

Once you add the Cratio CRM credentials, everything will work automatically:

1. ✅ Enquiry forms → Cratio CRM + Formspree
2. ✅ Course purchases → Lead saved + Razorpay redirect
3. ✅ Full integration ready

**Need detailed docs?** Check `INTEGRATION_GUIDE.md` for comprehensive documentation including advanced features, troubleshooting, and API reference.
