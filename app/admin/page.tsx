import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold">Humor Project Admin</h1>

            {!user ? (
                <a
                    href="/auth/login"
                    className="rounded bg-black px-6 py-3 text-white"
                >
                    Sign in with Google
                </a>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <p>Signed in as {user.email}</p>
                    <a
                        href="/admin"
                        className="rounded bg-black px-6 py-3 text-white"
                    >
                        Go to admin
                    </a>
                </div>
            )}
        </main>
    );
}