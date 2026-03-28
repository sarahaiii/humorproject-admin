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

        // upload file to storage
        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        // get public url
        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // insert into images table
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
            <h1 className="mb-6 text-3xl font-bold">Add Image</h1>

            <form action={createImage} className="max-w-md space-y-4">
                <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    required
                    className="w-full rounded border p-3"
                />

                <button className="rounded bg-black px-4 py-2 text-white">
                    Upload Image
                </button>
            </form>
        </main>
    );
}