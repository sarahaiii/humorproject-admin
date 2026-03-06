import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditImagePage({
                                                params,
                                            }: {
    params: { id: string };
}) {
    const supabase = await createClient();

    const { data: image } = await supabase
        .from("images")
        .select("*")
        .eq("id", params.id)
        .single();

    async function updateImage(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const image_url = formData.get("image_url");

        await supabase
            .from("images")
            .update({ image_url })
            .eq("id", params.id);

        redirect("/admin/images");
    }

    return (
        <main className="p-12">
            <h1 className="text-3xl font-bold mb-6">Edit Image</h1>

            <form action={updateImage} className="flex flex-col gap-4 max-w-md">

                <input
                    name="image_url"
                    defaultValue={image?.image_url}
                    className="border p-3 rounded"
                />

                <button className="bg-black text-white px-4 py-2 rounded">
                    Update Image
                </button>

            </form>
        </main>
    );
}