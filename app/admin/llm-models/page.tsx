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
        return (
            <main className="p-10 text-white">
                Error loading LLM models: {error.message}
            </main>
        );
    }

    const rows = data as LlmModelRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">LLM Models</h1>

                    <Link
                        href="/admin/llm-models/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900"
                    >
                        + Add Model
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
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

                            <tbody className="divide-y divide-gray-200">
                            {rows?.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{row.id}</td>
                                    <td className="px-6 py-4 font-medium">{row.name ?? "-"}</td>
                                    <td className="px-6 py-4">{row.llm_provider_id ?? "-"}</td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {row.provider_model_id ?? "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.is_temperature_supported ? "true" : "false"}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {row.created_datetime_utc ?? "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/admin/llm-models/edit/${row.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <form action={`/admin/llm-models/delete/${row.id}`}>
                                                <button className="text-red-600 hover:underline">
                                                    Delete
                                                </button>
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