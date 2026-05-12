"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/members";
  const [email, setEmail] = useState("demo@zocalo.health");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-phone flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-lg font-semibold text-white">
          C
        </div>
        <h1 className="text-xl font-medium text-neutral-900">Compañera</h1>
        <p className="mt-1 text-sm text-neutral-500">Zócalo Health · promotoras y planes de salud</p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-neutral-600">
            Correo
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-neutral-600">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
