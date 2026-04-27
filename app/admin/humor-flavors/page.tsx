import { createClient } from "@/lib/supabase/server";

type Flavor = {
    id: string;
    name?: string;
    description?: string;
};

export default async function HumorFlavorsPage() {
    const supabase = await createClient();

    const { data: flavors, error } = await supabase
        .from("humor_flavors")
        .select("*");

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading humor flavors: {error.message}</main>;
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Humor Flavors</h1>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Description</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {(flavors ?? []).map((f: Flavor) => (
                            <tr key={f.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4 font-mono text-xs">{f.id}</td>
                                <td className="px-6 py-4">{f.name ?? "-"}</td>
                                <td className="px-6 py-4">{f.description ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
