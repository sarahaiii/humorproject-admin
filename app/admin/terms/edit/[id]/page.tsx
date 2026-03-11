import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type TermRow = {
    id: string;
    term?: string | null;
    definition?: string | null;
};

export default async function EditTermPage({
                                               params,
                                           }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("terms")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return <main className="p-10 text-white">Error loading term: {error.message}</main>;
    }

    const term = data as TermRow;

    async function updateTerm(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const nextTerm = formData.get("term")?.toString() ?? "";
        const definition = formData.get("definition")?.toString() ?? "";

        await supabase
            .from("terms")
            .update({
                term: nextTerm,
                definition,
            })
            .eq("id", id);

        redirect("/admin/terms");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Edit Term</h1>

                <form action={updateTerm} className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Term</label>
                        <input
                            name="term"
                            defaultValue={term.term ?? ""}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Definition</label>
                        <textarea
                            name="definition"
                            rows={5}
                            defaultValue={term.definition ?? ""}
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