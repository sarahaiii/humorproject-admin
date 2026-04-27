import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditImagePage({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: image, error } = await supabase
        .from("images")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !image) {
        redirect("/admin/images");
    }

    async function updateImage(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            redirect("/login");
        }

        const url = formData.get("url")?.toString() ?? "";
        const additional_context = formData.get("additional_context")?.toString() ?? "";
        const image_description = formData.get("image_description")?.toString() ?? "";
        const celebrity_recognition = formData.get("celebrity_recognition")?.toString() ?? "";
        const is_public = formData.get("is_public") === "on";
        const is_common_use = formData.get("is_common_use") === "on";

        const { error: updateError } = await supabase
            .from("images")
            .update({
                url,
                additional_context: additional_context || null,
                image_description: image_description || null,
                celebrity_recognition: celebrity_recognition || null,
                is_public,
                is_common_use,
                modified_by_user_id: user.id,
            })
            .eq("id", id);

        if (updateError) {
            throw new Error(updateError.message);
        }

        redirect("/admin/images");
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-5xl font-bold text-[#0c1a2e]">Edit Image</h1>

                <div className="glass-card rounded-2xl p-8">
                    <div className="mb-8">
                        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#6a9cbf]">
                            Current Image
                        </p>

                        <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-blue-50">
                            <img
                                src={image.url}
                                alt="Current image"
                                className="max-h-[420px] w-full object-contain"
                            />
                        </div>
                    </div>

                    <form action={updateImage} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">
                                Image URL
                            </label>
                            <input
                                name="url"
                                defaultValue={image.url ?? ""}
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">
                                Additional Context
                            </label>
                            <textarea
                                name="additional_context"
                                defaultValue={image.additional_context ?? ""}
                                rows={4}
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                                placeholder="Extra caption context or instructions"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">
                                Image Description
                            </label>
                            <textarea
                                name="image_description"
                                defaultValue={image.image_description ?? ""}
                                rows={4}
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                                placeholder="Description of what appears in the image"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">
                                Celebrity Recognition
                            </label>
                            <textarea
                                name="celebrity_recognition"
                                defaultValue={image.celebrity_recognition ?? ""}
                                rows={4}
                                className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/50 p-4 text-[#1a3a5c] placeholder:text-[#6a9cbf]"
                                placeholder="Celebrity recognition result or notes"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-xl border border-[rgba(120,175,255,0.4)] bg-blue-50 p-4 text-[#1a3a5c]">
                                <input
                                    type="checkbox"
                                    name="is_public"
                                    defaultChecked={!!image.is_public}
                                    className="h-4 w-4"
                                />
                                <span>Public Image</span>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-[rgba(120,175,255,0.4)] bg-blue-50 p-4 text-[#1a3a5c]">
                                <input
                                    type="checkbox"
                                    name="is_common_use"
                                    defaultChecked={!!image.is_common_use}
                                    className="h-4 w-4"
                                />
                                <span>Common Use</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button className="rounded-xl bg-[#60a5fa] px-6 py-3 text-white transition hover:bg-[#3b82f6]">
                                Update Image
                            </button>

                            <a
                                href="/admin/images"
                                className="rounded-xl border border-[rgba(120,175,255,0.4)] px-6 py-3 text-[#1a3a5c] transition hover:bg-blue-50"
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
