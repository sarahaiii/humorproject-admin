import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type CaptionExampleRow = {
    id: string;
    caption?: string | null;
    example?: string | null;
};

export default async function EditCaptionExamplePage({
                                                         params,
                                                     }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("caption_examples")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading caption example: {error.message}
            </main>
        );
    }

    const row = data as CaptionExampleRow;

    async function updateCaptionExample(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const caption = formData.get("caption")?.toString() ?? "";
        const example = formData.get("example")?.toString() ?? "";

        await supabase
            .from("caption_examples")
            .update({
                caption,
                example,
            })
            .eq("id", id);

        redirect("/admin/caption-examples");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Edit Caption Example</h1>

                <form
                    action={updateCaptionExample}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Caption</label>
                        <input
                            name="caption"
                            defaultValue={row.caption ?? ""}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Example</label>
                        <textarea
                            name="example"
                            rows={5}
                            defaultValue={row.example ?? ""}
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