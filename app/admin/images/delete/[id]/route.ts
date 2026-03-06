import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    await supabase
        .from("images")
        .delete()
        .eq("id", params.id);

    redirect("/admin/images");
}