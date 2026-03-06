import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewImagePage() {
    async function createImage(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const image_url = formData.get("image_url");

        await supabase.from("images").insert({
            image_url,
        });

        redirect("/admin/images");
    }

    return (
        <main className="p-12">
            <h1 className="text-3xl font-bold mb-6">Add Image</h1>

            <form action={createImage} className="flex flex-col gap-4 max-w-md">

                <input
                    name="image_url"
                    placeholder="Image URL"
                    className="border p-3 rounded"
                />

                <button className="bg-black text-white px-4 py-2 rounded">
                    Create Image
                </button>

            </form>
        </main>
    );
}