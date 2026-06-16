import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAdmin, loginAdmin } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin · Empirical Society" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isAdmin()) navigate({ to: "/admin" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pw)) {
      navigate({ to: "/admin" });
    } else {
      setErr("Incorrect password.");
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-card border border-border p-8 space-y-6"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase">
            <span className="size-1.5 rounded-full bg-led led-dot" />
            Empirical · Admin
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Restricted access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin password to manage site content.
          </p>
        </div>
        <div>
          <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr("");
            }}
            autoFocus
            className="mt-2 w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-led transition-colors"
            placeholder="••••••••"
          />
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
          <p className="mt-3 text-[10px] text-muted-foreground/70">
            Hint (demo): <span className="font-mono">empirical2024</span>
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-led text-background font-semibold text-xs tracking-[0.18em] uppercase hover:bg-foreground transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
