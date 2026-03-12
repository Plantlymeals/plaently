import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomePayload {
  type: "welcome";
  record: { email: string };
}

interface CampaignPayload {
  type: "campaign";
  subject: string;
  html: string;
}

type RequestPayload = WelcomePayload | CampaignPayload;

async function sendEmail(
  resendKey: string,
  to: string | string[],
  subject: string,
  html: string
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "PLÄNTLY <noreply@notify.plaently.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${res.status} ${err}`);
  }

  return await res.json();
}

function buildWelcomeHtml(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Poppins',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="color:#5a8a2e;font-size:28px;margin:0">PLÄNTLY</h1>
    </div>
    <div style="background:#f6faf0;border-radius:16px;padding:32px 24px;text-align:center">
      <h2 style="color:#141414;font-size:22px;margin:0 0 12px">Välkommen till PLÄNTLY! 🌱</h2>
      <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 20px">
        Tack för att du prenumererar! Du får nu exklusiva erbjudanden, nya recept och 10% rabatt på din första beställning.
      </p>
      <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 24px">
        Welcome to PLÄNTLY! You'll receive exclusive offers, new recipes, and 10% off your first order.
      </p>
      <a href="https://plaently.com/products" style="display:inline-block;background:#5a8a2e;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px">
        Handla nu / Shop now
      </a>
    </div>
    <p style="text-align:center;color:#999;font-size:12px;margin-top:32px">
      © 2026 PLÄNTLY. Du får detta mail för att du prenumererar på vårt nyhetsbrev.
    </p>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const payload: RequestPayload = await req.json();

    if (payload.type === "welcome") {
      const { email } = payload.record;
      console.log("Sending welcome email to", email);
      const result = await sendEmail(
        resendKey,
        email,
        "Välkommen till PLÄNTLY! 🌱 Welcome to PLÄNTLY!",
        buildWelcomeHtml(email)
      );
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payload.type === "campaign") {
      // Verify admin auth
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );

      // Verify admin role
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch all subscribers using service role
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: subscribers, error: fetchError } = await adminClient
        .from("newsletter_subscribers")
        .select("email");

      if (fetchError) throw fetchError;
      if (!subscribers || subscribers.length === 0) {
        return new Response(
          JSON.stringify({ success: true, sent: 0, message: "No subscribers" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Send in batches of 50 (Resend batch limit)
      const emails = subscribers.map((s) => s.email);
      const batchSize = 50;
      let totalSent = 0;

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        // Send individually to avoid BCC exposure
        const promises = batch.map((email) =>
          sendEmail(resendKey, email, payload.subject, payload.html)
        );
        await Promise.all(promises);
        totalSent += batch.length;
      }

      console.log(`Campaign sent to ${totalSent} subscribers`);
      return new Response(
        JSON.stringify({ success: true, sent: totalSent }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid payload type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
