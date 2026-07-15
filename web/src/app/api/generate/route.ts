import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const internalApi =
  process.env.INTERNAL_API_URL ?? "http://prompt-optim-api:8000";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const auth = request.headers.get("authorization");

  const response = await fetch(`${internalApi}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body,
    signal: AbortSignal.timeout(115_000),
  });

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
