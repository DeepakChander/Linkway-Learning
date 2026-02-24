import { NextRequest, NextResponse } from "next/server";

const WEBHOOKS: Record<string, string> = {
  default: "https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=248590",
  hero: "https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=779820",
};

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

    // Build CRM payload
    const record: Record<string, string> = {
      "Contact Name": body.fullName,
      "Mobile Number": body.phone,
      Email: body.email,
      "Lead Date": new Date().toISOString().split("T")[0],
    };

    if (body.course) {
      record["Company Name"] = body.course;
    }

    // Submit to Cratio Webhook
    const webhookUrl = WEBHOOKS[body.webhookType] || WEBHOOKS.default;
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      console.error("Cratio webhook failed:", response.status);
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
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
