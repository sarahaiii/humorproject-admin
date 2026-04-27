import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewLlmModelPage() {
    async function createModel(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            redirect("/login");
        }

        const name = formData.get("name")?.toString().trim() ?? "";
        const providerName = formData.get("provider_name")?.toString().trim() ?? "";
        const provider_model_id = formData.get("provider_model_id")?.toString().trim() ?? "";
        const is_temperature_supported = formData.get("is_temperature_supported") === "on";

        if (!name || !providerName || !provider_model_id) {
            throw new Error("Please fill in all required fields.");
        }

        let { data: provider, error: providerLookupError } = await supabase
            .from("llm_providers")
            .select("id, name")
            .ilike("name", providerName)
            .maybeSingle();

        if (providerLookupError) {
            throw new Error(providerLookupError.message);
        }

        if (!provider) {
            const { data: newProvider, error: providerInsertError } = await supabase
                .from("llm_providers")
                .insert({
                    name: providerName,
                    created_by_user_id: user.id,
                    modified_by_user_id: user.id,
                })
                .select("id, name")
                .single();

            if (providerInsertError || !newProvider) {
                throw new Error(providerInsertError?.message ?? "Failed to create provider.");
            }

            provider = newProvider;
        }

        const { error: modelInsertError } = await supabase
            .from("llm_models")
            .insert({
                name,
                llm_provider_id: provider.id,
                provider_model_id,
                is_temperature_supported,
                created_by_user_id: user.id,
                modified_by_user_id: user.id,
            });

        if (modelInsertError) {
            throw new Error(modelInsertError.message);
        }

        redirect("/admin/llm-models");
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-5xl font-bold text-[#0c1a2e]">Add LLM Model</h1>
                    <Link
                        href="/admin/llm-models"
                        className="rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-2 text-[#1a3a5c] hover:bg-blue-50"
                    >
                        Back
                    </Link>
                </div>

                <div className="glass-card rounded-2xl p-8">
                    <form action={createModel} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Model Name</label>
                            <input
                                name="name"
                                required
                                placeholder="GPT 5 Mini"
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Provider Name</label>
                            <input
                                name="provider_name"
                                required
                                placeholder="OpenAI"
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Provider Model ID</label>
                            <input
                                name="provider_model_id"
                                required
                                placeholder="gpt-5-mini-2025-08-07"
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                            />
                        </div>

                        <label className="flex items-center gap-3 rounded-xl border border-[rgba(120,175,255,0.4)] bg-blue-50 p-4 text-[#1a3a5c]">
                            <input type="checkbox" name="is_temperature_supported" className="h-4 w-4" />
                            <span>Supports Temperature</span>
                        </label>

                        <div className="flex gap-4 pt-2">
                            <button className="rounded-xl bg-[#60a5fa] px-6 py-3 text-white hover:bg-[#3b82f6]">
                                Create Model
                            </button>
                            <Link
                                href="/admin/llm-models"
                                className="rounded-xl border border-[rgba(120,175,255,0.4)] px-6 py-3 text-[#1a3a5c] hover:bg-blue-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
