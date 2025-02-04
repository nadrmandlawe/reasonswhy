import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";

export async function GET(request: Request) {
  try {
    const result = await aj.protect(request);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to check request ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = body.data;
    
    // Create a request that includes both the original headers (for bot detection)
    // and the form data (for sensitive info checking)
    const combinedRequest = new Request(process.env.NEXTAUTH_URL!, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({
        name: formData.name,
        text: formData.text,
        location: formData.location,
        tags: formData.tags
      })
    });

    // Single check for bots, rate limits, and sensitive info
    const result = await aj.protect(combinedRequest);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to check request ${error}` },
      { status: 500 }
    );
  }
} 