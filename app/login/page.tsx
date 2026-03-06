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
    <main className="p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        onClick={handleLogin}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Sign in with Google
      </button>
    </main>
  );
}