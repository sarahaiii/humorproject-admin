export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Humor Project Admin</h1>

        <a
            href="/auth/login"
            className="rounded bg-black px-6 py-3 text-white"
        >
          Sign in with Google
        </a>
      </main>
  );
}