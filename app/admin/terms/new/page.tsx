import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewTermPage() {
    async function createTerm(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const term = formData.get("term")?.toString() ?? "";
        const definition = formData.get("definition")?.toString() ?? "";

        await supabase.from("terms").insert({ term, definition });
        redirect("/admin/terms");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Add Term</h1>

                <form action={createTerm} className="space-y-4 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Term</label>
                        <input name="term" className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-4 py-3 text-[#1a3a5c]" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Definition</label>
                        <textarea name="definition" rows={5} className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-4 py-3 text-[#1a3a5c]" />
                    </div>

                    <button className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3b82f6]">
                        Create Term
                    </button>
                </form>
            </div>
        </main>
    );
}
