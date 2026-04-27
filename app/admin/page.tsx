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

    const [{ count: userCount }, { count: imageCount }, { count: captionCount }] =
        await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("images").select("*", { count: "exact", head: true }),
            supabase.from("captions").select("*", { count: "exact", head: true }),
        ]);

    const { data: allVotes } = await supabase
        .from("caption_votes")
        .select("caption_id, vote_value");

    const votes: VoteRow[] = (allVotes ?? []) as VoteRow[];

    const totalVotes = votes.length;
    const totalLikes = votes.filter(v => Number(v.vote_value) > 0).length;
    const totalDislikes = votes.filter(v => Number(v.vote_value) < 0).length;
    const likeRate = totalVotes > 0 ? Math.round((totalLikes / totalVotes) * 100) : 0;

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
                    <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">Humor Project</p>
                    <h1 className="mt-3 text-5xl font-bold text-[#0c1a2e]">Admin Dashboard</h1>
                    <p className="mt-3 max-w-2xl text-[#6a9cbf]">
                        Manage all admin tables and project configuration from one place.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Users" value={userCount ?? 0} />
                    <StatCard label="Total Images" value={imageCount ?? 0} />
                    <StatCard label="Total Captions" value={captionCount ?? 0} />
                    <StatCard
                        label="Avg Captions / Image"
                        value={imageCount ? (captionCount! / imageCount!).toFixed(1) : "0.0"}
                    />
                </div>

                <h2 className="mt-10 mb-4 text-xl font-semibold text-[#0c1a2e]">Rating Activity</h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Votes Cast" value={totalVotes} accent="blue" />
                    <StatCard label="👍 Funny Votes" value={totalLikes} accent="green" />
                    <StatCard label="👎 Not Funny Votes" value={totalDislikes} accent="red" />
                    <StatCard label="Like Rate" value={`${likeRate}%`} accent="yellow" />
                </div>

                {topCaptions.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-xl font-semibold text-[#0c1a2e]">🏆 Top Rated Captions</h2>
                        <CaptionTable rows={topCaptions} scoreMap={scoreMap} showRank />
                    </section>
                )}

                {bottomCaptions.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-xl font-semibold text-[#0c1a2e]">💀 Lowest Rated Captions</h2>
                        <CaptionTable rows={bottomCaptions} scoreMap={scoreMap} />
                    </section>
                )}

                <section className="mt-12">
                    <h2 className="mb-1 text-2xl font-semibold text-[#0c1a2e]">Admin Sections</h2>

                    <div className="mt-6 mb-2 flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Editable</span>
                        <div className="flex-1 border-t border-amber-200" />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <AdminCard href="/admin/images" title="Images" />
                        <AdminCard href="/admin/llm-models" title="LLM Models" />
                        <AdminCard href="/admin/llm-providers" title="LLM Providers" />
                        <AdminCard href="/admin/terms" title="Terms" />
                        <AdminCard href="/admin/caption-examples" title="Caption Examples" />
                        <AdminCard href="/admin/allowed-signup-domains" title="Allowed Signup Domains" />
                        <AdminCard href="/admin/whitelist-emails" title="Whitelisted Emails" />
                    </div>

                    <div className="mt-8 mb-2 flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#6a9cbf]">View Only</span>
                        <div className="flex-1 border-t border-[rgba(120,175,255,0.3)]" />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <AdminCard href="/admin/users" title="Users" readOnly />
                        <AdminCard href="/admin/captions" title="Captions" readOnly />
                        <AdminCard href="/admin/humor-flavors" title="Humor Flavors" readOnly />
                        <AdminCard href="/admin/humor-flavor-steps" title="Humor Flavor Steps" readOnly />
                        <AdminCard href="/admin/humor-mix" title="Humor Mix" readOnly />
                        <AdminCard href="/admin/caption-requests" title="Caption Requests" readOnly />
                        <AdminCard href="/admin/llm-prompt-chains" title="LLM Prompt Chains" readOnly />
                        <AdminCard href="/admin/llm-responses" title="LLM Responses" readOnly />
                    </div>
                </section>
            </div>
        </main>
    );
}

function StatCard({
    label,
    value,
    accent = "blue",
}: {
    label: string;
    value: string | number;
    accent?: "blue" | "green" | "red" | "yellow";
}) {
    const colors = {
        blue:   "text-[#6a9cbf]",
        green:  "text-emerald-600",
        red:    "text-rose-500",
        yellow: "text-amber-500",
    };
    return (
        <div className="glass-card">
            <p className={`text-sm ${colors[accent]}`}>{label}</p>
            <p className="mt-3 text-4xl font-bold text-[#0c1a2e]">{value}</p>
        </div>
    );
}

type RankedRow = { id: string; cap: CaptionRow; stats: { score: number; likes: number; dislikes: number } };

function CaptionTable({ rows, scoreMap, showRank }: { rows: RankedRow[]; scoreMap: Record<string, { score: number; likes: number; dislikes: number }>; showRank?: boolean }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[rgba(120,175,255,0.3)] text-left text-[#6a9cbf] bg-blue-50">
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
                        <tr key={id} className="border-b border-[rgba(120,175,255,0.15)] hover:bg-blue-50/50 transition">
                            {showRank && (
                                <td className="px-5 py-3 text-[#6a9cbf] font-mono">{i + 1}</td>
                            )}
                            <td className="px-5 py-3 text-[#1a3a5c] max-w-xs">
                                <div className="line-clamp-2">{cap.content ?? "—"}</div>
                            </td>
                            <td className="px-5 py-3 text-center">
                                <span className={`font-bold text-base ${stats.score > 0 ? "text-emerald-600" : stats.score < 0 ? "text-rose-500" : "text-[#6a9cbf]"}`}>
                                    {stats.score > 0 ? `+${stats.score}` : stats.score}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-center text-emerald-600">{stats.likes}</td>
                            <td className="px-5 py-3 text-center text-rose-500">{stats.dislikes}</td>
                            <td className="px-5 py-3 text-center">
                                {cap.images?.[0]?.url ? (
                                    <img
                                        src={cap.images[0].url}
                                        alt=""
                                        className="mx-auto h-10 w-16 rounded-lg object-cover border border-[rgba(120,175,255,0.4)]"
                                    />
                                ) : (
                                    <span className="text-[#6a9cbf]">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AdminCard({ href, title, readOnly }: { href: string; title: string; readOnly?: boolean }) {
    return (
        <Link
            href={href}
            className={
                readOnly
                    ? "rounded-2xl border border-[rgba(120,175,255,0.25)] bg-white/50 p-6 text-[#1a3a5c] transition hover:bg-blue-50/60"
                    : "rounded-2xl border border-amber-200 bg-white/75 p-6 text-[#1a3a5c] transition hover:bg-amber-50"
            }
        >
            <div className="flex items-start justify-between gap-2">
                <div className="text-lg font-semibold text-[#0c1a2e]">{title}</div>
                {readOnly ? (
                    <span className="mt-0.5 shrink-0 rounded-full bg-[rgba(120,175,255,0.12)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#6a9cbf]">
                        view
                    </span>
                ) : (
                    <span className="mt-0.5 shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 border border-amber-200">
                        edit
                    </span>
                )}
            </div>
        </Link>
    );
}
