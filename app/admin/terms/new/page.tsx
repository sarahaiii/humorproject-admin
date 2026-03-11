import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewTermPage() {
    async function createTerm(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const term = formData.get("term")?.toString() ?? "";
        const definition = formData.get("definition")?.toString() ?? "";

        await supabase.from("terms").insert({
            term,
            definition,
        });

        redirect("/admin/terms");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Add Term</h1>

                <form action={createTerm} className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Term</label>
                        <input
                            name="term"
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Definition</label>
                        <textarea
                            name="definition"
                            rows={5}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Create Term
                    </button>
                </form>
            </div>
        </main>
    );
}