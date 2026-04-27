import { createClient } from "@/lib/supabase/server";

type CaptionRow = {
    id: string;
    caption?: string | null;
    text?: string | null;
    image_id?: string | null;
    user_id?: string | null;
};

export default async function CaptionsPage() {
    const supabase = await createClient();

    const { data: captions, error } = await supabase
        .from("captions")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading captions: {error.message}</main>;
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Captions</h1>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-[#1a3a5c]">
                            <thead className="bg-blue-50 text-[#6a9cbf]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Caption</th>
                                <th className="px-6 py-4 font-semibold">Image ID</th>
                                <th className="px-6 py-4 font-semibold">User ID</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                            {(captions as CaptionRow[] | null)?.map((caption) => (
                                <tr key={caption.id} className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4 align-top font-mono text-xs">{caption.id}</td>
                                    <td className="max-w-xl px-6 py-4 align-top">{caption.caption ?? caption.text ?? "-"}</td>
                                    <td className="px-6 py-4 align-top font-mono text-xs text-[#6a9cbf]">{caption.image_id ?? "-"}</td>
                                    <td className="px-6 py-4 align-top font-mono text-xs text-[#6a9cbf]">{caption.user_id ?? "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
