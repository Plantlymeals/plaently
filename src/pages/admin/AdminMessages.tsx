import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MailOpen, Reply, CornerDownRight, Send, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Submission = Tables<"contact_submissions">;
type ReplyRow = {
  id: string;
  submission_id: string;
  body: string;
  admin_email: string | null;
  email_sent: boolean;
  created_at: string;
};

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Submission[]>([]);
  const [replies, setReplies] = useState<Record<string, ReplyRow[]>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [latestTest, setLatestTest] = useState<{ status: string; created_at: string } | null>(null);

  const TEST_EMAIL = "ahmet@plaently.com";

  const fetchLatestTest = async () => {
    const { data } = await supabase
      .from("email_send_log")
      .select("status, created_at")
      .eq("recipient_email", TEST_EMAIL)
      .eq("template_name", "contact-reply")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setLatestTest(data as any);
  };

  const sendTestEmail = async () => {
    setTestSending(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/contact-reply-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          recipientEmail: TEST_EMAIL,
          recipientName: "Ahmet",
          replyBody: `Test email triggered from admin panel at ${new Date().toLocaleString()}.`,
          originalMessage: "(test ping from admin dashboard)",
        }),
      });
      if (!res.ok) throw new Error(`Send failed (${res.status})`);
      toast.success(`Test email sent to ${TEST_EMAIL}`);
      // give the queue a moment, then refresh
      setTimeout(fetchLatestTest, 1500);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send test email");
    } finally {
      setTestSending(false);
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const fetchReplies = async () => {
    const { data } = await supabase
      .from("message_replies")
      .select("id, submission_id, body, admin_email, email_sent, created_at")
      .order("created_at", { ascending: true });
    if (data) {
      const grouped: Record<string, ReplyRow[]> = {};
      for (const r of data as ReplyRow[]) {
        (grouped[r.submission_id] ||= []).push(r);
      }
      setReplies(grouped);
    }
  };

  useEffect(() => { fetchMessages(); fetchReplies(); fetchLatestTest(); }, []);

  const markRead = async (id: string, read: boolean) => {
    await supabase.from("contact_submissions").update({ is_read: read }).eq("id", id);
    toast.success(read ? "Marked as read" : "Marked as unread");
    fetchMessages();
  };

  const startReply = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    setDraft("");
  };

  const sendReply = async (m: Submission) => {
    const body = draft.trim();
    if (!body) { toast.error("Reply can't be empty"); return; }
    setSending(true);
    const { data: inserted, error } = await supabase
      .from("message_replies")
      .insert({
        submission_id: m.id,
        admin_id: user?.id ?? null,
        admin_email: user?.email ?? null,
        body,
      })
      .select()
      .single();
    if (error || !inserted) {
      setSending(false);
      toast.error(error?.message ?? "Failed to save reply");
      return;
    }

    let emailOk = false;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/contact-reply-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          recipientEmail: m.email,
          recipientName: m.name,
          replyBody: body,
          originalMessage: m.message,
          idempotencyKey: inserted.id,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { success?: boolean };
      emailOk = res.ok && payload.success !== false;
      if (!emailOk) console.error("contact reply email failed", { status: res.status });
    } catch (e) {
      console.error(e);
    }

    await supabase.from("message_replies").update({ email_sent: emailOk }).eq("id", inserted.id);
    if (!m.is_read) {
      await supabase.from("contact_submissions").update({ is_read: true }).eq("id", m.id);
    }

    toast.success(emailOk ? "Reply sent" : "Reply saved (email not sent)");
    setDraft("");
    setOpenId(null);
    setSending(false);
    fetchReplies();
    fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">
          Messages {unreadCount > 0 && <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">{unreadCount} new</span>}
        </h1>
        <div className="flex items-center gap-3">
          {latestTest && (
            <div className="text-xs text-muted-foreground text-right">
              <div>Last test: <span className={latestTest.status === "sent" ? "text-primary font-medium" : latestTest.status === "pending" ? "text-amber-600 font-medium" : "text-destructive font-medium"}>{latestTest.status}</span></div>
              <div>{new Date(latestTest.created_at).toLocaleString()}</div>
            </div>
          )}
          <Button onClick={sendTestEmail} disabled={testSending} variant="outline" size="sm" className="rounded-full gap-2">
            {testSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Send test email
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map(m => {
          const thread = replies[m.id] ?? [];
          const isOpen = openId === m.id;
          return (
            <div key={m.id} className={`bg-card rounded-xl border p-5 shadow-card space-y-3 ${m.is_read ? "border-border/50" : "border-primary/30"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email} · {new Date(m.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => markRead(m.id, !m.is_read)} title={m.is_read ? "Mark unread" : "Mark read"}>
                    {m.is_read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startReply(m.id)} title="Reply">
                    <Reply className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{m.message}</p>

              {thread.length > 0 && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20 ml-1">
                  {thread.map((r) => (
                    <div key={r.id} className="bg-primary/5 rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CornerDownRight className="h-3 w-3" />
                        <span className="font-medium">{r.admin_email ?? "Admin"}</span>
                        <span>· {new Date(r.created_at).toLocaleString()}</span>
                        {!r.email_sent && <span className="ml-1 text-amber-600">· email not sent</span>}
                      </div>
                      <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {isOpen && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Reply to ${m.name}…`}
                    rows={4}
                    className="rounded-xl"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => { setOpenId(null); setDraft(""); }} disabled={sending} className="rounded-full">Cancel</Button>
                    <Button size="sm" onClick={() => sendReply(m)} disabled={sending || !draft.trim()} className="rounded-full gap-2">
                      {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Send reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {messages.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;
