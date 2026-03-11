import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewLlmProviderPage() {
    async function createProvider(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const name = formData.get("name")?.toString() ?? "";

        await supabase.from("llm_providers").insert({
            name,
        });

        redirect("/admin/llm-providers");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Add LLM Provider</h1>

                <form
                    action={createProvider}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Name</label>
                        <input
                            name="name"
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Create Provider
                    </button>
                </form>
            </div>
        </main>
    );
}