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
        return (
            <main className="p-10 text-white">
                Error loading humor mix: {error.message}
            </main>
        );
    }

    const rows = mix as HumorMixRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-white">
                    Humor Mix
                </h1>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Flavor ID</th>
                            <th className="px-6 py-4 text-left">Weight</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {rows?.map((m) => (
                            <tr key={m.id}>
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