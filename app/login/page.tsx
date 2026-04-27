"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-card w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">Humor Project</p>
        <h1 className="mt-4 text-4xl font-bold text-[#0c1a2e]">Sign in</h1>
        <p className="mt-3 text-[#6a9cbf]">Admin access only.</p>
        <button
          onClick={handleLogin}
          className="mt-8 w-full rounded-full bg-[#60a5fa] px-6 py-3 font-semibold text-white transition hover:bg-[#3b82f6]"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
