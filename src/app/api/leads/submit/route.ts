import { NextRequest, NextResponse } from "next/server";
import { submitLeadToCratio } from "@/lib/api/cratio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract UTM parameters from headers or body
    const referer = request.headers.get("referer") || "";
    const url = new URL(referer || request.url);
    const utmSource = url.searchParams.get("utm_source") || body.utm_source;
    const utmMedium = url.searchParams.get("utm_medium") || body.utm_medium;
    const utmCampaign = url.searchParams.get("utm_campaign") || body.utm_campaign;

    // Submit to Cratio CRM
    const result = await submitLeadToCratio({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      background: body.background,
      course: body.course,
      source: body.source || "website",
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
    });

    if (!result.success) {
      console.error("Cratio CRM submission failed:", result.error);
      // Still return success to user, but log the error
      // Formspree will handle the backup in the frontend
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      leadId: result.leadId,
    });
  } catch (error) {
    console.error("Error in lead submission API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
