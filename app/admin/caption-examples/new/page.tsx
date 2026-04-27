import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewCaptionExamplePage() {
    async function createCaptionExample(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const caption = formData.get("caption")?.toString() ?? "";
        const example = formData.get("example")?.toString() ?? "";

        await supabase.from("caption_examples").insert({ caption, example });
        redirect("/admin/caption-examples");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Add Caption Example</h1>

                <form
                    action={createCaptionExample}
                    className="space-y-4 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Caption</label>
                        <input name="caption" className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-4 py-3 text-[#1a3a5c]" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Example</label>
                        <textarea name="example" rows={5} className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-4 py-3 text-[#1a3a5c]" />
                    </div>

                    <button className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3b82f6]">
                        Create Caption Example
                    </button>
                </form>
            </div>
        </main>
    );
}
