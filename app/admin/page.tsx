import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type CaptionRow = {
    caption?: string | null;
    text?: string | null;
};

export default async function AdminPage() {
    const supabase = await createClient();

    const [{ count: userCount }, { count: imageCount }, { count: captionCount }] =
        await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("images").select("*", { count: "exact", head: true }),
            supabase.from("captions").select("*", { count: "exact", head: true }),
        ]);

    const { data: latestCaptions } = await supabase
        .from("captions")
        .select("caption, text")
        .limit(20);

    const captionTexts = ((latestCaptions ?? []) as CaptionRow[])
        .map((c) => c.caption ?? c.text ?? "")
        .join(" ")
        .toLowerCase();

    const meCount = (captionTexts.match(/\bme\b/g) || []).length;
    const whenCount = (captionTexts.match(/\bwhen\b/g) || []).length;

    return (
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                        Humor Project
                    </p>
                    <h1 className="mt-3 text-5xl font-bold text-white">Admin Dashboard</h1>
                    <p className="mt-3 max-w-2xl text-indigo-100/70">
                        Monitor core platform activity, manage data, and track humor-caption patterns.
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

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="glass-card">
                        <h2 className="text-2xl font-semibold text-white">Caption Pattern Snapshot</h2>
                        <p className="mt-5 text-indigo-100/75">
                            In the latest caption sample,{" "}
                            <span className="font-semibold text-white">“me”</span> appeared{" "}
                            <span className="font-semibold text-white">{meCount}</span> times and{" "}
                            <span className="font-semibold text-white">“when”</span> appeared{" "}
                            <span className="font-semibold text-white">{whenCount}</span> times.
                        </p>
                    </section>

                    <section className="glass-card">
                        <h2 className="text-2xl font-semibold text-white">Quick Navigation</h2>

                        <div className="mt-6 grid gap-4">
                            <Link
                                href="/admin/users"
                                className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-4 text-indigo-50 transition hover:bg-indigo-500/20"
                            >
                                Manage Users
                            </Link>

                            <Link
                                href="/admin/images"
                                className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-4 text-indigo-50 transition hover:bg-indigo-500/20"
                            >
                                Manage Images
                            </Link>

                            <Link
                                href="/admin/captions"
                                className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-4 text-indigo-50 transition hover:bg-indigo-500/20"
                            >
                                View Captions
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}