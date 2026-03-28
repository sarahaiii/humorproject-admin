import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, is_superadmin")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        redirect("/");
    }

    if (!profile.is_superadmin) {
        redirect("/");
    }

    const [{ count: userCount }, { count: imageCount }, { count: captionCount }] =
        await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("images").select("*", { count: "exact", head: true }),
            supabase.from("captions").select("*", { count: "exact", head: true }),
        ]);

    return (
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                        Humor Project
                    </p>
                    <h1 className="mt-3 text-5xl font-bold text-white">Admin Dashboard</h1>
                    <p className="mt-3 max-w-2xl text-indigo-100/70">
                        Manage all admin tables and project configuration from one place.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="glass-card">
                        <p className="text-sm text-indigo-200/70">Total Users</p>
                        <p className="mt-3 text-4xl font-bold text-white">{userCount ?? 0}</p>
                    </div>

                    <div className="glass-card">
                        <p className="text-sm text-indigo-200/70">Total Images</p>
                        <p className="mt-3 text-4xl font-bold text-white">{imageCount ?? 0}</p>
                    </div>

                    <div className="glass-card">
                        <p className="text-sm text-indigo-200/70">Total Captions</p>
                        <p className="mt-3 text-4xl font-bold text-white">{captionCount ?? 0}</p>
                    </div>

                    <div className="glass-card">
                        <p className="text-sm text-indigo-200/70">Avg Captions / Image</p>
                        <p className="mt-3 text-4xl font-bold text-white">
                            {imageCount ? (captionCount! / imageCount!).toFixed(1) : "0.0"}
                        </p>
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="mb-6 text-2xl font-semibold text-white">
                        Admin Sections
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <AdminCard href="/admin/users" title="Users" />
                        <AdminCard href="/admin/images" title="Images" />
                        <AdminCard href="/admin/captions" title="Captions" />
                        <AdminCard href="/admin/humor-flavors" title="Humor Flavors" />
                        <AdminCard href="/admin/humor-flavor-steps" title="Humor Flavor Steps" />
                        <AdminCard href="/admin/humor-mix" title="Humor Mix" />
                        <AdminCard href="/admin/terms" title="Terms" />
                        <AdminCard href="/admin/caption-examples" title="Caption Examples" />
                        <AdminCard href="/admin/caption-requests" title="Caption Requests" />
                        <AdminCard href="/admin/llm-models" title="LLM Models" />
                        <AdminCard href="/admin/llm-providers" title="LLM Providers" />
                        <AdminCard href="/admin/llm-prompt-chains" title="LLM Prompt Chains" />
                        <AdminCard href="/admin/llm-responses" title="LLM Responses" />
                        <AdminCard href="/admin/allowed-signup-domains" title="Allowed Signup Domains" />
                        <AdminCard href="/admin/whitelist-emails" title="Whitelisted Emails" />
                    </div>
                </section>
            </div>
        </main>
    );
}

function AdminCard({ href, title }: { href: string; title: string }) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-6 text-indigo-50 transition hover:bg-indigo-500/20"
        >
            <div className="text-lg font-semibold">{title}</div>
            <p className="mt-2 text-sm text-indigo-200/70">
                Open {title.toLowerCase()}
            </p>
        </Link>
    );
}