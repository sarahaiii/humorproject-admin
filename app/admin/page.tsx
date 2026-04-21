import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type VoteRow = { caption_id: string; vote_value: number };
type CaptionRow = { id: string; content: string | null; image_id: string | null; images: { url: string }[] | null };

export default async function AdminPage() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, is_superadmin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_superadmin) redirect("/");

    // Basic counts
    const [{ count: userCount }, { count: imageCount }, { count: captionCount }] =
        await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("images").select("*", { count: "exact", head: true }),
            supabase.from("captions").select("*", { count: "exact", head: true }),
        ]);

    // All votes for aggregation
    const { data: allVotes } = await supabase
        .from("caption_votes")
        .select("caption_id, vote_value");

    const votes: VoteRow[] = (allVotes ?? []) as VoteRow[];

    const totalVotes = votes.length;
    const totalLikes = votes.filter(v => Number(v.vote_value) > 0).length;
    const totalDislikes = votes.filter(v => Number(v.vote_value) < 0).length;
    const likeRate = totalVotes > 0 ? Math.round((totalLikes / totalVotes) * 100) : 0;

    // Aggregate score per caption
    const scoreMap: Record<string, { score: number; likes: number; dislikes: number }> = {};
    for (const v of votes) {
        const val = Number(v.vote_value);
        if (!scoreMap[v.caption_id]) scoreMap[v.caption_id] = { score: 0, likes: 0, dislikes: 0 };
        scoreMap[v.caption_id].score += val;
        if (val > 0) scoreMap[v.caption_id].likes += 1;
        else scoreMap[v.caption_id].dislikes += 1;
    }

    const sorted = Object.entries(scoreMap).sort((a, b) => b[1].score - a[1].score);
    const topIds = sorted.slice(0, 10).map(([id]) => id);
    const bottomIds = [...sorted].reverse().slice(0, 10).map(([id]) => id);
    const allRankedIds = [...new Set([...topIds, ...bottomIds])];

    // Fetch caption text + image for ranked captions
    let captionDetails: CaptionRow[] = [];
    if (allRankedIds.length > 0) {
        const { data } = await supabase
            .from("captions")
            .select("id, content, image_id, images(url)")
            .in("id", allRankedIds);
        captionDetails = (data ?? []) as CaptionRow[];
    }

    const captionMap = Object.fromEntries(captionDetails.map(c => [c.id, c]));

    const topCaptions = topIds.map(id => ({ id, cap: captionMap[id], stats: scoreMap[id] })).filter(r => r.cap);
    const bottomCaptions = bottomIds.map(id => ({ id, cap: captionMap[id], stats: scoreMap[id] })).filter(r => r.cap);

    return (
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">Humor Project</p>
                    <h1 className="mt-3 text-5xl font-bold text-white">Admin Dashboard</h1>
                    <p className="mt-3 max-w-2xl text-indigo-100/70">
                        Manage all admin tables and project configuration from one place.
                    </p>
                </div>

                {/* ── Content stats ── */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Users" value={userCount ?? 0} />
                    <StatCard label="Total Images" value={imageCount ?? 0} />
                    <StatCard label="Total Captions" value={captionCount ?? 0} />
                    <StatCard
                        label="Avg Captions / Image"
                        value={imageCount ? (captionCount! / imageCount!).toFixed(1) : "0.0"}
                    />
                </div>

                {/* ── Vote stats ── */}
                <h2 className="mt-10 mb-4 text-xl font-semibold text-white">Rating Activity</h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Votes Cast" value={totalVotes} accent="indigo" />
                    <StatCard label="👍 Funny Votes" value={totalLikes} accent="green" />
                    <StatCard label="👎 Not Funny Votes" value={totalDislikes} accent="red" />
                    <StatCard label="Like Rate" value={`${likeRate}%`} accent="yellow" />
                </div>

                {/* ── Top captions ── */}
                {topCaptions.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-xl font-semibold text-white">🏆 Top Rated Captions</h2>
                        <CaptionTable rows={topCaptions} scoreMap={scoreMap} showRank />
                    </section>
                )}

                {/* ── Worst captions ── */}
                {bottomCaptions.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-xl font-semibold text-white">💀 Lowest Rated Captions</h2>
                        <CaptionTable rows={bottomCaptions} scoreMap={scoreMap} />
                    </section>
                )}

                {/* ── Admin sections ── */}
                <section className="mt-12">
                    <h2 className="mb-6 text-2xl font-semibold text-white">Admin Sections</h2>
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

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    accent = "indigo",
}: {
    label: string;
    value: string | number;
    accent?: "indigo" | "green" | "red" | "yellow";
}) {
    const colors = {
        indigo: "text-indigo-200/70",
        green:  "text-emerald-300/80",
        red:    "text-rose-300/80",
        yellow: "text-yellow-300/80",
    };
    return (
        <div className="glass-card">
            <p className={`text-sm ${colors[accent]}`}>{label}</p>
            <p className="mt-3 text-4xl font-bold text-white">{value}</p>
        </div>
    );
}

type RankedRow = { id: string; cap: CaptionRow; stats: { score: number; likes: number; dislikes: number } };

function CaptionTable({ rows, scoreMap, showRank }: { rows: RankedRow[]; scoreMap: Record<string, { score: number; likes: number; dislikes: number }>; showRank?: boolean }) {
    return (
        <div className="glass-card overflow-hidden p-0">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-indigo-400/20 text-left text-indigo-200/60">
                        {showRank && <th className="px-5 py-3 w-10">#</th>}
                        <th className="px-5 py-3">Caption</th>
                        <th className="px-5 py-3 w-20 text-center">Score</th>
                        <th className="px-5 py-3 w-20 text-center">👍</th>
                        <th className="px-5 py-3 w-20 text-center">👎</th>
                        <th className="px-5 py-3 w-24 text-center">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ id, cap, stats }, i) => (
                        <tr key={id} className="border-b border-indigo-400/10 hover:bg-indigo-500/10 transition">
                            {showRank && (
                                <td className="px-5 py-3 text-indigo-300/60 font-mono">{i + 1}</td>
                            )}
                            <td className="px-5 py-3 text-indigo-100 max-w-xs">
                                <div className="line-clamp-2">{cap.content ?? "—"}</div>
                            </td>
                            <td className="px-5 py-3 text-center">
                                <span className={`font-bold text-base ${stats.score > 0 ? "text-emerald-400" : stats.score < 0 ? "text-rose-400" : "text-indigo-300"}`}>
                                    {stats.score > 0 ? `+${stats.score}` : stats.score}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-center text-emerald-300/80">{stats.likes}</td>
                            <td className="px-5 py-3 text-center text-rose-300/80">{stats.dislikes}</td>
                            <td className="px-5 py-3 text-center">
                                {cap.images?.[0]?.url ? (
                                    <img
                                        src={cap.images[0].url}
                                        alt=""
                                        className="mx-auto h-10 w-16 rounded-lg object-cover border border-indigo-400/20"
                                    />
                                ) : (
                                    <span className="text-indigo-300/40">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AdminCard({ href, title }: { href: string; title: string }) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-6 text-indigo-50 transition hover:bg-indigo-500/20"
        >
            <div className="text-lg font-semibold">{title}</div>
            <p className="mt-2 text-sm text-indigo-200/70">Open {title.toLowerCase()}</p>
        </Link>
    );
}
