import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewCaptionExamplePage() {
    async function createCaptionExample(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const caption = formData.get("caption")?.toString() ?? "";
        const example = formData.get("example")?.toString() ?? "";

        await supabase.from("caption_examples").insert({
            caption,
            example,
        });

        redirect("/admin/caption-examples");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Add Caption Example</h1>

                <form
                    action={createCaptionExample}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Caption</label>
                        <input
                            name="caption"
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Example</label>
                        <textarea
                            name="example"
                            rows={5}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Create Caption Example
                    </button>
                </form>
            </div>
        </main>
    );
}