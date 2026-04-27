import { createClient } from "@/lib/supabase/server";

type Row = {
    id: string;
    created_datetime_utc?: string | null;
    llm_model_id?: number | null;
    caption_request_id?: number | null;
    processing_time_seconds?: number | null;
    llm_temperature?: number | null;
};

export default async function LlmResponsesPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("llm_model_responses")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(50);

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error: {error.message}</main>;
    }

    const rows = data as Row[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-4xl font-bold text-[#0c1a2e]">LLM Responses</h1>

                <div className="overflow-hidden rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Model</th>
                            <th className="px-6 py-4 text-left">Caption Request</th>
                            <th className="px-6 py-4 text-left">Processing Time</th>
                            <th className="px-6 py-4 text-left">Temperature</th>
                            <th className="px-6 py-4 text-left">Created</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {rows?.map((r) => (
                            <tr key={r.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4 font-mono text-xs text-[#6a9cbf]">{r.id}</td>
                                <td className="px-6 py-4">{r.llm_model_id}</td>
                                <td className="px-6 py-4">{r.caption_request_id}</td>
                                <td className="px-6 py-4">{r.processing_time_seconds}</td>
                                <td className="px-6 py-4">{r.llm_temperature}</td>
                                <td className="px-6 py-4 text-xs text-[#6a9cbf]">{r.created_datetime_utc}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
