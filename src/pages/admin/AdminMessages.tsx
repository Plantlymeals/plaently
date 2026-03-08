import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, MailOpen } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"contact_submissions">;

const AdminMessages = () => {
  const [messages, setMessages] = useState<Submission[]>([]);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string, read: boolean) => {
    await supabase.from("contact_submissions").update({ is_read: read }).eq("id", id);
    toast.success(read ? "Marked as read" : "Marked as unread");
    fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">
          Messages {unreadCount > 0 && <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">{unreadCount} new</span>}
        </h1>
      </div>

      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`bg-card rounded-xl border p-5 shadow-card space-y-2 ${m.is_read ? "border-border/50 opacity-70" : "border-primary/30"}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email} · {new Date(m.created_at).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => markRead(m.id, !m.is_read)}>
                {m.is_read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
              </Button>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;
