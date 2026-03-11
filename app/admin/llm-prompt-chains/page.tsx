import { createClient } from "@/lib/supabase/server";

type Row = {
    id: number;
    llm_model_id?: number | null;
    humor_flavor_id?: number | null;
    created_datetime_utc?: string | null;
};

export default async function PromptChainsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("llm_prompt_chains")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(100);

    if (error) {
        return <main className="p-10 text-white">Error: {error.message}</main>;
    }

    const rows = data as Row[];

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-4xl font-bold text-white">
                    LLM Prompt Chains
                </h1>

                <div className="overflow-hidden rounded-xl bg-white shadow text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Model</th>
                            <th className="px-6 py-4 text-left">Humor Flavor</th>
                            <th className="px-6 py-4 text-left">Created</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y">
                        {rows?.map((r) => (
                            <tr key={r.id}>
                                <td className="px-6 py-4">{r.id}</td>
                                <td className="px-6 py-4">{r.llm_model_id}</td>
                                <td className="px-6 py-4">{r.humor_flavor_id}</td>
                                <td className="px-6 py-4 text-xs">
                                    {r.created_datetime_utc}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}