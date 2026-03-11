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
        return (
            <main className="p-10 text-white">
                Error loading humor flavor steps: {error.message}
            </main>
        );
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-white">
                    Humor Flavor Steps
                </h1>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Flavor ID</th>
                            <th className="px-6 py-4 text-left">Step</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {(steps as HumorFlavorStepRow[] | null)?.map((step) => (
                            <tr key={step.id}>
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