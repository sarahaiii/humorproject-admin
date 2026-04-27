import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ImageRow = {
    id: string;
    url?: string | null;
    created_datetime_utc?: string | null;
};

export default async function ImagesPage() {
    const supabase = await createClient();

    const { data: images, error } = await supabase
        .from("images")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return (
            <main className="p-10 text-[#1a3a5c]">
                Error loading images: {error.message}
            </main>
        );
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-[#0c1a2e]">Images</h1>
                        <p className="mt-2 text-[#6a9cbf]">
                            Create, view, edit, and delete images.
                        </p>
                    </div>

                    <Link
                        href="/admin/images/new"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + Add Image
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {(images as ImageRow[] | null)?.map((img) => (
                        <div
                            key={img.id}
                            className="overflow-hidden rounded-3xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm"
                        >
                            <div className="aspect-[4/3] bg-blue-50">
                                {img.url ? (
                                    <img
                                        src={img.url}
                                        alt="image preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-[#6a9cbf]">
                                        No image preview
                                    </div>
                                )}
                            </div>

                            <div className="p-5 text-[#1a3a5c]">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#6a9cbf]">
                                    ID
                                </p>
                                <p className="mt-2 break-all font-mono text-sm">{img.id}</p>

                                <div className="mt-5 flex items-center gap-5 text-sm font-medium">
                                    <Link
                                        href={`/admin/images/edit/${img.id}`}
                                        className="text-[#3b82f6] hover:underline"
                                    >
                                        Edit
                                    </Link>

                                    <form action={`/admin/images/delete/${img.id}`}>
                                        <button className="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
