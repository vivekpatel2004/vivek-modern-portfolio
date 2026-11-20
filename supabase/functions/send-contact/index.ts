import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const configuredOrigin = Deno.env.get("PORTFOLIO_ORIGIN")?.trim().replace(/\/+$/, "");

function corsHeaders(origin: string | null) {
  const allowedOrigin = configuredOrigin
    ? (origin === configuredOrigin ? configuredOrigin : "")
    : "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(body: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, headers);

  if (configuredOrigin && req.headers.get("origin") !== configuredOrigin) {
    return jsonResponse({ error: "Request origin is not allowed." }, 403, headers);
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Please provide valid contact details." }, 400, headers);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Please provide valid contact details." }, 400, headers);
    }
    const { name, email, message } = body as Record<string, unknown>;
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
        !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 5 ||
        name.length > 120 || email.length > 254 || message.length > 5000) {
      return jsonResponse({ error: "Please provide valid contact details." }, 400, headers);
    }
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("CONTACT_TO_EMAIL");
    if (!apiKey || !toEmail) {
      return jsonResponse({ error: "Message could not be sent." }, 503, headers);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("CONTACT_FROM_EMAIL") ?? "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio enquiry from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });
    if (!response.ok) {
      return jsonResponse({ error: "Message could not be sent." }, 502, headers);
    }
    return jsonResponse({ ok: true }, 200, headers);
  } catch {
    return jsonResponse({ error: "Message could not be sent." }, 500, headers);
  }
});
