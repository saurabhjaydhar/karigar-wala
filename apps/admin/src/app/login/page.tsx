"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { adminLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminLogin({ email, password });
      await queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4">
      <BackgroundBubbles />
      <Card variant="glass" className="relative w-full max-w-sm p-7 shadow-xl shadow-brand-navy-950/10">
        <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Karigar Saathi operations dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Label>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </Label>
          <Label>
            Password
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={submitting} className="mt-1 w-full">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
