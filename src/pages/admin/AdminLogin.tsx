import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@/lib/router-compat";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rawNext = params.get("next");
  // Only allow same-origin relative paths.
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;

  // Return to the preserved destination as soon as the user is signed in.
  useEffect(() => {
    if (user && next) {
      navigate(next, { replace: true });
      return;
    }
    if (user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome back!");
    // Navigation handled by useEffect when isAdmin becomes true
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold">PLÄNTLY Admin</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@plantly.com"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
