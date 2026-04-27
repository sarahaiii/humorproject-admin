import { createClient } from "@/lib/supabase/server";

type HumorMixRow = {
    id: string;
    flavor_id?: string | null;
    weight?: number | null;
};

export default async function HumorMixPage() {
    const supabase = await createClient();

    const { data: mix, error } = await supabase
        .from("humor_flavor_mix")
        .select("*");

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading humor mix: {error.message}</main>;
    }

    const rows = mix as HumorMixRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Humor Mix</h1>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Flavor ID</th>
                            <th className="px-6 py-4 text-left">Weight</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {rows?.map((m) => (
                            <tr key={m.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4 font-mono text-xs">{m.id}</td>
                                <td className="px-6 py-4">{m.flavor_id ?? "-"}</td>
                                <td className="px-6 py-4">{m.weight ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
