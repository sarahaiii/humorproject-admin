import { createClient } from "@/lib/supabase/server";

type HumorFlavorStepRow = {
    id: string;
    flavor_id?: string | null;
    step?: string | null;
};

export default async function HumorFlavorStepsPage() {
    const supabase = await createClient();

    const { data: steps, error } = await supabase
        .from("humor_flavor_steps")
        .select("*");

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading humor flavor steps: {error.message}</main>;
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Humor Flavor Steps</h1>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Flavor ID</th>
                            <th className="px-6 py-4 text-left">Step</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {(steps as HumorFlavorStepRow[] | null)?.map((step) => (
                            <tr key={step.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4 font-mono text-xs">{step.id}</td>
                                <td className="px-6 py-4">{step.flavor_id ?? "-"}</td>
                                <td className="px-6 py-4">{step.step ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
