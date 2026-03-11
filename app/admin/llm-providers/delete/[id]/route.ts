import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    await supabase
        .from("llm_providers")
        .delete()
        .eq("id", params.id);

    redirect("/admin/llm-providers");
}