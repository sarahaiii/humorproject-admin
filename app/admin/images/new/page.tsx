import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewImagePage() {
    async function createImage(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const image_url = formData.get("image_url")?.toString() ?? "";

        await supabase.from("images").insert({
            image_url,
        });

        redirect("/admin/images");
    }

    return (
        <main className="p-12">
            <h1 className="mb-6 text-3xl font-bold">Add Image</h1>

            <form action={createImage} className="max-w-md space-y-4">
                <input
                    name="image_url"
                    placeholder="Image URL"
                    className="w-full rounded border p-3"
                />
                <button className="rounded bg-black px-4 py-2 text-white">
                    Create Image
                </button>
            </form>
        </main>
    );
}