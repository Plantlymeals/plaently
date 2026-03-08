import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data.user) {
      setDone(true);
      toast.success("Account created! Tell the developer to assign admin role, then go to /admin/login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold">Admin Setup</h1>
            <p className="text-sm text-muted-foreground">Create your first admin account</p>
          </div>

          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Account created! Once your admin role is assigned, sign in below.</p>
              <Button onClick={() => navigate("/admin/login")} className="rounded-full w-full">Go to Admin Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@plantly.com" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="rounded-xl" />
              </div>
              <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
                {loading ? "Creating…" : "Create Admin Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
