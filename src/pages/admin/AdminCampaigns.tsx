import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Users, Mail } from "lucide-react";

const AdminCampaigns = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const { data: subscriberCount } = useQuery({
    queryKey: ["subscriber-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const wrapInTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Poppins',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="color:#5a8a2e;font-size:28px;margin:0">PLÄNTLY</h1>
    </div>
    <div style="padding:0 8px">
      ${content.split("\n").map((line) => (line.trim() ? `<p style="color:#141414;font-size:15px;line-height:1.6;margin:0 0 16px">${line}</p>` : "")).join("\n")}
    </div>
    <div style="text-align:center;margin-top:32px">
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

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Please fill in both subject and body");
      return;
    }

    const confirmed = window.confirm(
      `Send this campaign to ${subscriberCount ?? "all"} subscribers?`
    );
    if (!confirmed) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-newsletter", {
        body: {
          type: "campaign",
          subject: subject.trim(),
          html: wrapInTemplate(body),
        },
      });

      if (error) throw error;

      toast.success(`Campaign sent to ${data.sent} subscribers!`);
      setSubject("");
      setBody("");
    } catch (err: any) {
      toast.error("Failed to send campaign", { description: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Email Campaigns</h1>
        <p className="text-muted-foreground mt-1">Send email campaigns to newsletter subscribers via Resend</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{subscriberCount ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Total subscribers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Resend</p>
              <p className="text-sm text-muted-foreground">Email provider connected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Campaign</CardTitle>
          <CardDescription>Write your email content. It will be wrapped in the PLÄNTLY brand template.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
            <Input
              placeholder="e.g. New meals just dropped! 🌱"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Body</label>
            <Textarea
              placeholder="Write your email content here... Each paragraph will be separated automatically."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : `Send to ${subscriberCount ?? "all"} subscribers`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampaigns;
