import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LlmModelRow = {
    id: string | number;
    name?: string | null;
};

export default async function EditLlmModelPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("llm_models")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading model: {error.message}
            </main>
        );
    }

    const row = data as LlmModelRow;

    async function updateModel(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const name = formData.get("name")?.toString() ?? "";

        await supabase
            .from("llm_models")
            .update({ name })
            .eq("id", id);

        redirect("/admin/llm-models");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Edit LLM Model</h1>

                <form
                    action={updateModel}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Name</label>
                        <input
                            name="name"
                            defaultValue={row.name ?? ""}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}