/**
 * Cratio CRM API Integration
 *
 * API Docs: https://api.cratiocrm.com/
 * Base URL: http://apps.cratiocrm.com/api/apirequest.php
 * Auth: apikey as query parameter
 * Limit: 250 API calls/day
 *
 * SETUP:
 * Add to .env.local:
 *   CRATIO_API_URL=http://apps.cratiocrm.com/api/apirequest.php
 *   CRATIO_API_KEY=your_api_key_here
 */

const CRATIO_BASE_URL =
  process.env.CRATIO_API_URL ||
  "http://apps.cratiocrm.com/api/apirequest.php";

// --- Types ---

export interface CratioLeadData {
  fullName: string;
  email: string;
  phone: string;
  background?: string;
  course?: string;
  source?: string;
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

interface CratioInsertSuccess {
  rowindex: number;
  formid: string;
  info: string;
  "Lead Owner"?: string;
}

interface CratioError {
  rowindex: number;
  formid: string | string[];
  info: string;
}

interface CratioSearchResponse {
  pageno: number;
  totalrows: number;
  responserows: number;
  data: Record<string, string>[];
}

// --- Helpers ---

function buildUrl(operation: string, extraParams?: Record<string, string>): string {
  const apiKey = process.env.CRATIO_API_KEY;
  if (!apiKey) throw new Error("CRATIO_API_KEY not configured");

  const params = new URLSearchParams({
    operation,
    apikey: apiKey,
    formname: "Leads",
    ...extraParams,
  });

  return `${CRATIO_BASE_URL}?${params.toString()}`;
}

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// --- Create Lead ---

export async function submitLeadToCratio(
  leadData: CratioLeadData
): Promise<CratioAPIResponse> {
  try {
    const apiKey = process.env.CRATIO_API_KEY;

    if (!apiKey) {
      console.warn(
        "Cratio CRM API not configured. Add CRATIO_API_KEY to .env.local"
      );
      return { success: false, error: "CRM API not configured" };
    }

    const url = buildUrl("insertRecords", { overwrite: "false" });

    const record: Record<string, string> = {
      "Contact Name": leadData.fullName,
      "Mobile Number": leadData.phone,
      "Email": leadData.email,
      "Lead Date": todayDate(),
    };

    if (leadData.course) record["Company Name"] = leadData.course;

    const body = JSON.stringify({ records: [record] });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();

    // Success response: {"success":[{"rowindex":1,"formid":"12039","info":"created"}]}
    if (data.success && Array.isArray(data.success)) {
      const first = data.success[0] as CratioInsertSuccess;
      return {
        success: true,
        message: first.info || "Lead created",
        leadId: first.formid,
      };
    }

    // Error response: {"error":[{"rowindex":1,"formid":[],"info":"Mobile ... already linked"}]}
    if (data.error) {
      const errors = Array.isArray(data.error) ? data.error : [data.error];
      const firstError = errors[0] as CratioError;
      const errorMsg =
        typeof firstError === "string" ? firstError : firstError.info;
      console.error("Cratio API Error:", errorMsg);
      return { success: false, error: errorMsg };
    }

    return { success: false, error: "Unexpected API response" };
  } catch (error) {
    console.error("Error submitting lead to Cratio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- Update Lead ---

export async function updateLeadInCratio(
  formId: string,
  fields: Record<string, string>
): Promise<CratioAPIResponse> {
  try {
    const url = buildUrl("updateRecords");

    const record = { "Form ID": formId, ...fields };
    const body = JSON.stringify({ records: [record] });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.success)) {
      return { success: true, message: data.success[0]?.info || "updated" };
    }

    if (data.error) {
      const errors = Array.isArray(data.error) ? data.error : [data.error];
      return { success: false, error: errors[0]?.info || "Update failed" };
    }

    return { success: false, error: "Unexpected API response" };
  } catch (error) {
    console.error("Error updating lead in Cratio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- Get All Leads ---

export async function getAllLeadsFromCratio(options?: {
  displayfields?: string[];
  pageno?: number;
  numofrecords?: number;
  sortcolumn?: string;
  sortorder?: "asc" | "desc";
}): Promise<CratioSearchResponse | { error: string }> {
  try {
    const url = buildUrl("getAllRecords");

    const body = JSON.stringify({
      displayfields: options?.displayfields || [
        "Contact Name",
        "Mobile Number",
        "Email",
        "Lead Date",
        "Lead Stage",
      ],
      pageno: options?.pageno || 1,
      numofrecords: options?.numofrecords || 50,
      sortcolumn: options?.sortcolumn || "Lead Date",
      sortorder: options?.sortorder || "desc",
      isnull: 1,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching leads from Cratio:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// --- Search Leads ---

export async function searchLeadsInCratio(
  searchcondition: string,
  options?: {
    displayfields?: string[];
    pageno?: number;
    numofrecords?: number;
    sortcolumn?: string;
    sortorder?: "asc" | "desc";
  }
): Promise<CratioSearchResponse | { error: string }> {
  try {
    const url = buildUrl("getRecordsBySearch");

    const body = JSON.stringify({
      displayfields: options?.displayfields || [
        "Contact Name",
        "Mobile Number",
        "Email",
        "Lead Date",
        "Lead Stage",
      ],
      pageno: options?.pageno || 1,
      numofrecords: options?.numofrecords || 50,
      sortcolumn: options?.sortcolumn || "Lead Date",
      sortorder: options?.sortorder || "desc",
      isnull: 1,
      searchcondition,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    return await response.json();
  } catch (error) {
    console.error("Error searching leads in Cratio:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}