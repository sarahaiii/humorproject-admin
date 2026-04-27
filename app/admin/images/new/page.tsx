import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewImagePage() {
    async function createImage(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            redirect("/login");
        }

        const file = formData.get("image_file") as File | null;

        if (!file || file.size === 0) {
            throw new Error("Please choose a file");
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        const { error: insertError } = await supabase
            .from("images")
            .insert({
                url: publicUrl,
                created_by_user_id: user.id,
                modified_by_user_id: user.id,
            });

        if (insertError) {
            throw new Error(insertError.message);
        }

        redirect("/admin/images");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-md">
                <h1 className="mb-6 text-3xl font-bold text-[#0c1a2e]">Add Image</h1>

                <form action={createImage} className="space-y-4 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6">
                    <input
                        type="file"
                        name="image_file"
                        accept="image/*"
                        required
                        className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] p-3 text-[#1a3a5c]"
                    />

                    <button className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3b82f6]">
                        Upload Image
                    </button>
                </form>
            </div>
        </main>
    );
}
