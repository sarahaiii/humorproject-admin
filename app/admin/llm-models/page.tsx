import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type LlmModelRow = {
    id: string | number;
    name?: string | null;
    llm_provider_id?: string | number | null;
    provider_model_id?: string | null;
    is_temperature_supported?: boolean | null;
    created_datetime_utc?: string | null;
};

export default async function LlmModelsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("llm_models")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading LLM models: {error.message}</main>;
    }

    const rows = data as LlmModelRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-[#0c1a2e]">LLM Models</h1>
                    <Link
                        href="/admin/llm-models/new"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + Add Model
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-[#1a3a5c]">
                            <thead className="bg-blue-50 text-[#6a9cbf]">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Provider ID</th>
                                <th className="px-6 py-4 text-left">Provider Model ID</th>
                                <th className="px-6 py-4 text-left">Temperature?</th>
                                <th className="px-6 py-4 text-left">Created</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                            {rows?.map((row) => (
                                <tr key={row.id} className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4">{row.id}</td>
                                    <td className="px-6 py-4 font-medium">{row.name ?? "-"}</td>
                                    <td className="px-6 py-4">{row.llm_provider_id ?? "-"}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{row.provider_model_id ?? "-"}</td>
                                    <td className="px-6 py-4">{row.is_temperature_supported ? "true" : "false"}</td>
                                    <td className="px-6 py-4 text-xs text-[#6a9cbf]">{row.created_datetime_utc ?? "-"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <Link href={`/admin/llm-models/edit/${row.id}`} className="text-[#3b82f6] hover:underline">Edit</Link>
                                            <form action={`/admin/llm-models/delete/${row.id}`}>
                                                <button className="text-red-500 hover:underline">Delete</button>
                                            </form>
                                        </div>
                                    </td>
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
