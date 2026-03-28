import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditCaptionExamplePage({
                                                         params,
                                                     }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // get caption example
    const { data: example, error } = await supabase
        .from("caption_examples")
        .select("*")
        .eq("id", id)
        .single();

    // get all images for dropdown
    const { data: images } = await supabase
        .from("images")
        .select("id, url")
        .order("created_datetime_utc");

    if (error || !example) {
        redirect("/admin/caption-examples");
    }

    async function updateExample(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const caption = formData.get("caption")?.toString() ?? "";
        const explanation = formData.get("explanation")?.toString() ?? "";
        const priority = Number(formData.get("priority") ?? 0);
        const image_id = formData.get("image_id")?.toString() || null;

        await supabase
            .from("caption_examples")
            .update({
                caption,
                explanation,
                priority,
                image_id,
            })
            .eq("id", id);

        redirect("/admin/caption-examples");
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-5xl font-bold text-white">
                        Edit Caption Example
                    </h1>

                    <Link
                        href="/admin/caption-examples"
                        className="rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/10"
                    >
                        Back
                    </Link>
                </div>

                <div className="glass-card rounded-2xl p-8 space-y-6">

                    <form action={updateExample} className="space-y-6">

                        {/* caption */}
                        <div>
                            <label className="block text-indigo-100 mb-2">
                                Caption
                            </label>

                            <input
                                name="caption"
                                defaultValue={example.caption ?? ""}
                                className="w-full rounded-xl border border-white/20 bg-transparent p-4 text-white"
                            />
                        </div>

                        {/* explanation */}
                        <div>
                            <label className="block text-indigo-100 mb-2">
                                Explanation
                            </label>

                            <textarea
                                name="explanation"
                                rows={6}
                                defaultValue={example.explanation ?? ""}
                                className="w-full rounded-xl border border-white/20 bg-transparent p-4 text-white"
                            />
                        </div>

                        {/* priority */}
                        <div>
                            <label className="block text-indigo-100 mb-2">
                                Priority
                            </label>

                            <input
                                type="number"
                                name="priority"
                                defaultValue={example.priority ?? 0}
                                className="w-full rounded-xl border border-white/20 bg-transparent p-4 text-white"
                            />
                        </div>

                        {/* image dropdown */}
                        <div>
                            <label className="block text-indigo-100 mb-2">
                                Image
                            </label>

                            <select
                                name="image_id"
                                defaultValue={example.image_id ?? ""}
                                className="w-full rounded-xl border border-white/20 bg-transparent p-4 text-white"
                            >
                                <option value="">None</option>

                                {images?.map((img) => (
                                    <option key={img.id} value={img.id}>
                                        {img.id.slice(0,8)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* submit */}
                        <div className="flex gap-4 pt-2">

                            <button className="rounded-xl bg-black px-6 py-3 text-white">
                                Update Caption Example
                            </button>

                            <Link
                                href="/admin/caption-examples"
                                className="rounded-xl border border-white/20 px-6 py-3 text-white"
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