/**
 * Cratio CRM API Integration
 *
 * SETUP INSTRUCTIONS:
 * 1. Contact Cratio CRM support (support@cratio.com) to get:
 *    - API endpoint URL
 *    - API Key / Authentication token
 *    - Required field mappings
 *
 * 2. Add these to your .env.local file:
 *    NEXT_PUBLIC_CRATIO_API_URL=https://api.cratio.com/v1/leads
 *    CRATIO_API_KEY=your_api_key_here
 *
 * 3. Update the field mappings in this file based on Cratio's requirements
 */

export interface CratioLeadData {
  fullName: string;
  email: string;
  phone: string;
  background?: string;
  course?: string;
  source?: string; // e.g., "website", "landing_page"
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface CratioAPIResponse {
  success: boolean;
  message?: string;
  leadId?: string;
  error?: string;
}

/**
 * Submit lead to Cratio CRM
 *
 * This function handles the API call to Cratio CRM's lead capture endpoint.
 * Common API patterns for CRM systems:
 *
 * METHOD 1: REST API with JSON (Most Common)
 * POST https://api.cratio.com/v1/leads
 * Headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" }
 * Body: { "name": "...", "email": "...", "phone": "...", ... }
 *
 * METHOD 2: Form Data
 * POST https://api.cratio.com/v1/leads
 * Headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/x-www-form-urlencoded" }
 * Body: name=...&email=...&phone=...
 *
 * METHOD 3: API Key in URL
 * POST https://api.cratio.com/v1/leads?api_key=YOUR_API_KEY
 */
export async function submitLeadToCratio(
  leadData: CratioLeadData
): Promise<CratioAPIResponse> {
  try {
    // Get API configuration from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_CRATIO_API_URL;
    const apiKey = process.env.CRATIO_API_KEY;

    // If API is not configured, fall back to Formspree (current implementation)
    if (!apiUrl || !apiKey) {
      console.warn(
        "Cratio CRM API not configured. Please add NEXT_PUBLIC_CRATIO_API_URL and CRATIO_API_KEY to your .env.local file."
      );
      return {
        success: false,
        error: "CRM API not configured",
      };
    }

    // Map form data to Cratio CRM field names
    // UPDATE THESE FIELD NAMES based on your Cratio CRM configuration
    const cratioPayload = {
      // Standard fields (adjust field names as needed)
      lead_name: leadData.fullName,
      email: leadData.email,
      phone: leadData.phone,

      // Optional fields
      ...(leadData.background && { background: leadData.background }),
      ...(leadData.course && { interested_course: leadData.course }),
      ...(leadData.source && { lead_source: leadData.source }),

      // UTM tracking parameters
      ...(leadData.utm_source && { utm_source: leadData.utm_source }),
      ...(leadData.utm_medium && { utm_medium: leadData.utm_medium }),
      ...(leadData.utm_campaign && { utm_campaign: leadData.utm_campaign }),

      // Additional metadata
      submitted_at: new Date().toISOString(),
      website: "linkwaylearning.com",
    };

    // Method 1: JSON API (Most common)
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // or "X-API-Key": apiKey
        Accept: "application/json",
      },
      body: JSON.stringify(cratioPayload),
    });

    // Alternative Method 2: Form Data (Uncomment if needed)
    /*
    const formData = new URLSearchParams();
    Object.entries(cratioPayload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: formData,
    });
    */

    // Alternative Method 3: API Key in URL (Uncomment if needed)
    /*
    const response = await fetch(`${apiUrl}?api_key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cratioPayload),
    });
    */

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cratio API Error:", errorData);
      return {
        success: false,
        error: errorData.message || `API Error: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message || "Lead submitted successfully",
      leadId: data.id || data.lead_id || data.leadId,
    };
  } catch (error) {
    console.error("Error submitting lead to Cratio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * CURL Example for Testing:
 *
 * Once you have your API credentials, test with:
 *
 * curl -X POST https://api.cratio.com/v1/leads \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_API_KEY" \
 *   -d '{
 *     "lead_name": "Test User",
 *     "email": "test@example.com",
 *     "phone": "+919876543210",
 *     "interested_course": "Data Analytics",
 *     "lead_source": "website"
 *   }'
 *
 * Check the response to understand:
 * 1. The exact field names Cratio expects
 * 2. The response format
 * 3. Error handling patterns
 */
