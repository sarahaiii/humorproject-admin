import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditImagePage({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: image } = await supabase
        .from("images")
        .select("*")
        .eq("id", id)
        .single();

    async function updateImage(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const image_url = formData.get("image_url")?.toString() ?? "";

        await supabase.from("images").update({ image_url }).eq("id", id);

        redirect("/admin/images");
    }

    return (
        <main className="p-12">
            <h1 className="mb-6 text-3xl font-bold">Edit Image</h1>

            <form action={updateImage} className="max-w-md space-y-4">
                <input
                    name="image_url"
                    defaultValue={image?.image_url ?? ""}
                    className="w-full rounded border p-3"
                />
                <button className="rounded bg-black px-4 py-2 text-white">
                    Update Image
                </button>
            </form>
        </main>
    );
}